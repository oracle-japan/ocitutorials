---
title: "アイデンティティ チュートリアル"
excerpt: "OCIのユーザー認証・アクセス制御を統合的に管理するIAM・IDaaSを提供するOCI Identity Domainsについて学習できるチュートリアルです。"
permalink: /identity/
layout: single
# layout: collection
# entries_layout: grid
# tags: "security"
show_excerpts: true
# classes: wide
toc: true
---

<!-- このページのpath:

/ocitutorials/_pages/identity
-->

Oracle Cloud Infrastructureは、設計段階からセキュリティを考慮して開発されたクラウドサービスになります。
セキュリティに非常に力を入れて取り組んでおり、無償でご利用いただけるクラウドサービスも多数提供しています。

このページではアイデンティティ編として、Oracle Cloud Infrastructureにて提供しているIDaaSサービス「Identity Domains」のチュートリアルをまとめています。

<br/>


# OCI IAM Identity Domainsチュートリアル

+ **[OCI IAM Identity Domainsのドメインの追加とライセンスタイプを変更する](/ocitutorials/identity/identitydomain-createdomain-alterdomaintype)**  
   本チュートリアルでは、Identity Domainsのドメインタイプを新規作成する手順と、ドメインのライセンスタイプの変更手順を紹介します。

+ **[OCI IAM Identity Domains - テナント管理者・一般ユーザーを作成する](/ocitutorials/identity/identitydomain-setup-users/)**  
   本チュートリアルではIdentity DomainsでのOCIテナント管理者ユーザーと、一般ユーザーの作成手順を紹介します。

+ **[OCI IAM Identity DomainでユーザーのMFAを有効化する](/ocitutorials/identity/identitydomain-mfa/)**  
   本チュートリアルでは、Identity Domainsの特定のグループに属しているユーザーに二要素認証を要求するための設定手順を紹介します。

+ **[OCI IAM Identity DomainsとAzure ADとの認証連携（外部IDP連携）を設定する](/ocitutorials/identity/identitydomain-azuread/)**  
   本チュートリアルでは、SAMLによるIdentity DomainsとAzure ADとの認証連携を設定する手順を紹介します。本チュートリアルを完了することで、Azure ADのIDとパスワードでOCIにサインオンすることが可能になります。

+ **[OCI IAM Identity DomainでAPEXで作成したアプリに認証と認可をする](/ocitutorials/identity/identitydomain-apex-sso/)**  
   本チュートリアルでは、Oracle Application Express（APEX）で作成したアプリケーションとIdentity Domainsの認証連携、およびIdentity Domainsのグループに基づくアクセス制御（認可）の実装手順を紹介します。

+ **[OCI IAM Identity Domainsで複数Identity Domain間の認証連携環境を構築する](https://speakerdeck.com/oracle4engineer/sso-setup-between-multiple-identity-domains)**  
   本チュートリアルは外部のページで、複数のOCI IAM Identity Domain間で認証連携およびユーザー同期を行うための実装手順を紹介しています。

+ **[OCI IAM Identity DomainsのIdPポリシーの設定を行う](https://speakerdeck.com/oracle4engineer/identity-domain-idp-policy)**  
   本チュートリアルは外部のページで、OCI IAM Identity DomainsのIdPポリシーの設定手順を紹介しています。

+ **[OCI IAM Identity DomainsでSAMLでの認証連携を行う](https://speakerdeck.com/oracle4engineer/identity-domain-saml-basic)**  
   本チュートリアルは外部のページで、OCI IAM Identity DomainsでのSAMLによる認証連携（SP Initiate）の設定手順を紹介しています。

+ **[OCI IAM Identity DomainsでOpenID Connectでの認証連携を行う](https://speakerdeck.com/oracle4engineer/identity-domain-openid-connect-basic)**  
   本チュートリアルは外部のページで、OCI IAM Identity DomainsでのOpenID Connect（認可コードフロー）による認証設定手順を紹介しています。

+ **[OCI IAM Identity DomainsでAWSとSAMLでの認証連携を行う](https://speakerdeck.com/oracle4engineer/oci-iam-identity-domainstoawstonoren-zheng-lian-xi-she-ding-shou-shun)**  
   本チュートリアルは外部のページで、OCI IAM Identity DomainsでAWSとSAMLによる認証連携（SP Initiate）の設定手順を紹介しています。

+ **[OCI IAM Identity DomainsでMFAを利用するモバイル端末を変更する](https://speakerdeck.com/oracle4engineer/identity-domain-change-mobile-device-for-mfa)**  
   本チュートリアルは外部のページで、OCI IAM Identity DomainsでOCIコンソールへのアクセス時の2要素認証で利用するモバイル端末の変更手順を紹介しています。

+ **[OCI IAM Identity DomainsでMFAバイパスコードを利用する](https://speakerdeck.com/oracle4engineer/identity-domain-bypass-code-for-mfa)**  
   本チュートリアルは外部のページで、OCI IAM Identity Domainsでバイパスコードを利用する手順を紹介しています。

+ **[OCI IAM Identity DomainsでActive Directory Domain ServiceからIDやグループ情報を同期する環境を作成する](https://speakerdeck.com/oracle4engineer/id-sync-settings-with-ad)**  
   本チュートリアルは外部のページで、OCI IAM Identity DomainsにAD Bridgeを利用しAD DSよりユーザー・グループ情報を同期するための実装手順を紹介しています。

+ **[OCI IAM Identity DomainsでOktaとSAMLでの認証連携を行う](https://speakerdeck.com/oracle4engineer/oci-iam-identity-domain-oktatonoren-zheng-lian-xi-she-ding-shou-shun)**  
   本チュートリアルは外部のページで、OCI IAM Identity DomainsでOktaとSAMLによる認証連携の設定手順を紹介しています。

+ **[OCI IAM Identity DomainsでSSO対象アプリアクセス時のMFA要求・IPアクセス制御を行う](https://speakerdeck.com/oracle4engineer/oci-iam-identity-domains-mfa-and-ip-address-access-control-for-sso-apps)**  
   本チュートリアルでは、OCI Identity Domainsにて、サインオンポリシーを利用しSSO対象アプリケーションアクセス時にMFA要求やIPアドレスによるアクセス制御を行うための設定手順です。 ※OCIコンソールは対象外です。

+ **[OCI IAM Identity DomainsでIPアドレスによるOCIコンソールアクセスの制御を行う](https://speakerdeck.com/oracle4engineer/oci-iam-identity-domains-control-oci-console-access-by-ip-address)**  
   本チュートリアルでは、OCIコンソールにアクセスできるIPアドレスを制御するためのIdentity Domainsの設定手順になります。