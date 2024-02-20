-- you must not change the owner of the functionality to avoid future issues
define clouduser=C##CLOUD$SERVICE

-- CUSTOMER SPECIFIC SETUP, NEEDS TO BE PROVIDED BY THE CUSTOMER
-- - SSL Wallet directory and password
define sslwalletdir=<Set SSL Wallet Directory>
define sslwalletpwd=<Set SSL Wallet password>

-- create and run this procedure as owner of the ACLs, which is the future owner
-- of DBMS_CLOUD
CREATE OR REPLACE PROCEDURE &clouduser..GET_PAGE(url IN VARCHAR2) AS
request_context UTL_HTTP.REQUEST_CONTEXT_KEY;
req UTL_HTTP.REQ;
resp UTL_HTTP.RESP;
data VARCHAR2(32767) default null;
err_num NUMBER default 0;
err_msg VARCHAR2(4000) default null;

BEGIN

-- Create a request context with its wallet and cookie table
request_context := UTL_HTTP.CREATE_REQUEST_CONTEXT(
wallet_path => 'file:&sslwalletdir',
wallet_password => '&sslwalletpwd');

-- Make a HTTP request using the private wallet and cookie
-- table in the request context
req := UTL_HTTP.BEGIN_REQUEST(
url => url,
request_context => request_context);

resp := UTL_HTTP.GET_RESPONSE(req);

DBMS_OUTPUT.PUT_LINE('valid response');

EXCEPTION
WHEN OTHERS THEN
err_num := SQLCODE;
err_msg := SUBSTR(SQLERRM, 1, 3800);
DBMS_OUTPUT.PUT_LINE('possibly raised PLSQL/SQL error: ' ||err_num||' - '||err_msg);

UTL_HTTP.END_RESPONSE(resp);
data := UTL_HTTP.GET_DETAILED_SQLERRM ;
IF data IS NOT NULL THEN
DBMS_OUTPUT.PUT_LINE('possibly raised HTML error: ' ||data);
END IF;
END;
/
set serveroutput on
BEGIN
&clouduser..GET_PAGE('https://objectstorage.eu-frankfurt-1.oci.customer-oci.com');
END;
/

set serveroutput off
drop procedure &clouduser..GET_PAGE;