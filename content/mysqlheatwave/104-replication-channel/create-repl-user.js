// MySQL Shell Community 26.7.1 / JavaScript用。
// 専用プロセスの認証済みソースsessionで使用する。秘密は非表示入力のみ。
// expectedSourceUuidとtargetPrivateIpを非秘密の検証済み値で事前設定する。
(function () {
  function need(value, message) { if (!value) throw new Error(message); }
  need(typeof expectedSourceUuid === 'string' && /^[0-9a-f-]{36}$/i.test(expectedSourceUuid), 'Set the verified full source UUID');
  need(typeof targetPrivateIp === 'string', 'Set target private IPv4');
  var octets = targetPrivateIp.split('.');
  need(octets.length === 4 && octets.every(function (part) {
    return /^(0|[1-9][0-9]{0,2})$/.test(part) && Number(part) <= 255;
  }), 'Invalid IPv4');
  var identity = session.runSql('-- 目的: 専用アカウントを作るソースと書込み可否を確認する。\nSELECT @@server_uuid,@@read_only,@@super_read_only').fetchOne();
  need(identity[0] === expectedSourceUuid && Number(identity[1]) === 0 && Number(identity[2]) === 0, 'Wrong source or not writable');
  var cipher = session.runSql("-- 目的: 秘密の送信前にTLS暗号化を確認する。\nSHOW SESSION STATUS LIKE 'Ssl_cipher'").fetchOne();
  need(cipher && String(cipher[1]).length > 0, 'TLS required');
  var accounts = session.runSql("-- 目的: 同名の既存アカウントを上書きしないため確認する。\nSELECT COUNT(*) FROM mysql.user WHERE User='tutorial_repl104'").fetchOne();
  need(Number(accounts[0]) === 0, 'Account name already exists; inspect before retry');
  // 専用クライアントプロセス内だけの設定。DBサーバー監査設定は変更しない。
  shell.options.set('history.autoSave', false);
  shell.options.set('logSql', 'off');
  shell.options.set('logLevel', 'none');
  var password = shell.prompt('New replication password: ', {type:'password'});
  var confirmation = shell.prompt('Confirm replication password: ', {type:'password'});
  // SQLリテラルへ安全に埋め込める限定文字集合。引用符、空白、バックスラッシュを許さない。
  // 入力条件は8～128文字、英大/小文字、数字、許可記号の全種類。実運用の強度保証ではない。
  // サーバー側のパスワードポリシーに拒否されても、そのポリシーを緩和しない。
  var valid = /^[A-Za-z0-9!#%+,\-.:=@^_]{8,128}$/.test(password) &&
    /[a-z]/.test(password) && /[A-Z]/.test(password) && /[0-9]/.test(password) &&
    /[!#%+,\-.:=@^_]/.test(password) && password === confirmation;
  if (!valid) {
    password = null; confirmation = null;
    throw new Error('Password must match and use 8-128 allowed characters with upper/lower/digit/symbol');
  }
  try {
    // 目的: 宛先IPだけから接続でき、TLSを必須とする新規専用アカウントを設定する。
    session.runSql("-- 目的: 専用レプリケーション認証を設定する。\nCREATE USER 'tutorial_repl104'@'" + targetPrivateIp + "' IDENTIFIED WITH caching_sha2_password BY '" + password + "' REQUIRE SSL");
    password = null; confirmation = null;
    // 目的: データ変更権限を与えず、レプリケーション読取りだけを許可する。
    session.runSql("-- 目的: 複製に必要な権限のみを付与する。\nGRANT REPLICATION SLAVE ON *.* TO 'tutorial_repl104'@'" + targetPrivateIp + "'");
  } catch (error) {
    password = null; confirmation = null;
    // 例外の元メッセージやSQL文字列には秘密が含まれ得るため表示しない。
    throw new Error('Account step failed. Inspect non-secret account/grant state before any retry.');
  }
  var account = session.runSql("-- 目的: 秘密や認証ハッシュを読まず作成設定を確認する。\nSELECT User,Host,plugin,ssl_type FROM mysql.user WHERE User='tutorial_repl104' AND Host=?",[targetPrivateIp]).fetchOne();
  need(account && account[2] === 'caching_sha2_password' && account[3] === 'ANY', 'Account settings mismatch');
  print('REPL_ACCOUNT_CREATED user=tutorial_repl104 host=' + targetPrivateIp + ' TLS=required');
})();
