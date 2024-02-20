@$ORACLE_HOME/rdbms/admin/sqlsessstart.sql

-- target sample user
define clouduser=SCOTT

-- CUSTOMER SPECIFIC SETUP, NEEDS TO BE PROVIDED BY THE CUSTOMER
-- - SSL Wallet directory
define sslwalletdir=<Set SSL Wallet Directory>

-- Proxy definition
define proxy_uri=<your proxy URI address>
define proxy_host=<your proxy DNS name>
define proxy_low_port=<your_proxy_low_port>
define proxy_high_port=<your_proxy_high_port>

-- Create New ACL / ACE s
begin
-- Allow all hosts for HTTP/HTTP_PROXY
dbms_network_acl_admin.append_host_ace(
host =>'*',
lower_port => 443,
upper_port => 443,
ace => xs$ace_type(
privilege_list => xs$name_list('http', 'http_proxy'),
principal_name => upper('&clouduser'),
principal_type => xs_acl.ptype_db));

--
-- UNCOMMENT THE PROXY SETTINGS SECTION IF YOUR ENVIRONMENT NEEDS PROXYS
--
-- Allow Proxy for HTTP/HTTP_PROXY
-- dbms_network_acl_admin.append_host_ace(
-- host =>'&proxy_host',
-- lower_port => &proxy_low_port,
-- upper_port => &proxy_high_port,
-- ace => xs$ace_type(
-- privilege_list => xs$name_list('http', 'http_proxy'),
-- principal_name => upper('&clouduser'),
-- principal_type => xs_acl.ptype_db));
--
-- END PROXY SECTION
--

-- Allow wallet access
dbms_network_acl_admin.append_wallet_ace(
wallet_path => 'file:&sslwalletdir',
ace => xs$ace_type(privilege_list =>
xs$name_list('use_client_certificates', 'use_passwords'),
principal_name => upper('&clouduser'),
principal_type => xs_acl.ptype_db));
end;
/

@$ORACLE_HOME/rdbms/admin/sqlsessend.sql