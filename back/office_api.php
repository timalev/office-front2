<?php
error_reporting(E_ALL);
header ('Access-Control-Allow-Origin:*');
header ('Access-Control-Allow-Credentials:true');
header ('Access-Control-Allow-Methods:*');
header ('Access-Control-Allow-Headers:Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
header('Content-type: text/html; charset=UTF-8');


$host="localhost";
$login="root";
$pass="soprod12";
$dbname="rieltorov";


		if (!$conn = mysqli_connect($host,$login,$pass,$dbname))
			echo "ERR: Can't connect to mysql server<br>";




	mysqli_query($conn, "SET NAMES utf8");


	
$post = json_decode(file_get_contents('php://input'), true);

if(isset($post['json']))
{
	 $sql_q = "UPDATE of_tables SET _tables='".$post['json']."' WHERE id=1";
     if (!$sql_res = mysqli_query($conn,$sql_q)) echo "[\"err\"]";
	 else echo "[\"ok\"]";
}
if(isset($post['user']) && isset($post['login']) && isset($post['status']))
{
	$sql_q = "INSERT INTO of_users (_users,_emails,_status) VALUES ('".$post['user']."','".$post['login']."','".$post['status']."')";
    if (!$sql_res = mysqli_query($conn,$sql_q)) echo "[\"err\"]";
	else echo "[\"ok\"]";
}
if(isset($post['office_name']))
{
	$sql_q = "INSERT INTO of_offices (_names) VALUES ('".$post['office_name']."')";
    if (!$sql_res = mysqli_query($conn,$sql_q)) echo "[\"err\"]";
	else echo "[\"ok\"]";
}


	if (isset($_GET["type"])) {

		switch ($_GET["type"]) {
			case "users":
				$users = array();
			    $sql_q = "SELECT * FROM of_users ORDER BY id ASC";
		        if (!$sql_res = mysqli_query($conn,$sql_q))echo "[\"err\"]";
				
				while ($rows = mysqli_fetch_array($sql_res))
					$users[] = '{"id":'.$rows["id"].',"name": "'.$rows["_users"].'","group": '.$rows["_groups"].'}';
				
				echo '['.implode(",",$users).']';
			break;

			case "tables":
				$sql_q = "SELECT * FROM of_tables WHERE id=1";
		        if (!$sql_res = mysqli_query($conn,$sql_q))echo "[\"err\"]";
				$rows = mysqli_fetch_array($sql_res);
				echo $rows["_tables"];
			break;

			case "status":
			    $sql_q = "SELECT * FROM of_users WHERE _emails='".$_GET["user"]."'";
		        if (!$sql_res = mysqli_query($conn,$sql_q))echo "[\"err\"]";
				$rows = mysqli_fetch_array($sql_res);
				//echo '{"'.$rows["_status"].'"}';
                echo '{"status": "'.$rows["_status"].'"}';
				
			break;

			default:
				$groups = array();
			    $sql_q = "SELECT * FROM of_groups ORDER BY id ASC";
		        if (!$sql_res = mysqli_query($conn,$sql_q))echo "[\"err\"]";
				
				while ($rows = mysqli_fetch_array($sql_res))
					$groups[] = '{"id":'.$rows["id"].',"name": "'.$rows["_groups"].'"}';
				
				echo '['.implode(",",$groups).']';

		}
	}
	
	



?>
