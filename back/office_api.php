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
if(isset($post['add_user']) && isset($post['group']))
{
	$sql_q = "UPDATE of_users SET _groups=".$post['group']." WHERE id=".$post['add_user'];
    if (!$sql_res = mysqli_query($conn,$sql_q)) echo "[\"err\"]";
	else echo "[\"ok\"]";
}


if(isset($post['unbook']))
{
	$sql_q = "DELETE FROM of_booking WHERE _name='".trim($post['unbook'])."'";
    if (!$sql_res = mysqli_query($conn,$sql_q)) echo "[\"err\"]";
	else echo "[\"ok\"]";
}



if(isset($post['add_group']) && isset($post['office']))
{
	$sql_q = "UPDATE of_groups SET offices=".$post['office']." WHERE id=".$post['add_group'];
    if (!$sql_res = mysqli_query($conn,$sql_q)) echo "[\"err\"]";
	else echo "[\"ok\"]";
}

if(isset($post['group_name']))
{
	$sql_q = "INSERT INTO of_groups (_groups) VALUES ('".trim($post['group_name'])."')";
    if (!$sql_res = mysqli_query($conn,$sql_q)) echo "[\"err\"]";
	else echo "[\"".mysqli_insert_id($conn)."\"]";
}

if(isset($post['book_name']) && isset($post['book_date']) && isset($post['book_time']) && isset($post['user']))
{
	$date = explode("-",$post['book_date']);

	$sql_q = "INSERT INTO of_booking (_name,_date,_datetime,_user) VALUES ('".$post['book_name']."','".$date[0]."-".$date[1]."-".$date[2]."','".trim($post['book_time'])."','".$post['user']."')";
    if (!$sql_res = mysqli_query($conn,$sql_q)) echo "[\"err\"]";
	else echo "[\"".mysqli_insert_id($conn)."\"]";
}



	if (isset($_GET["type"])) {

		switch ($_GET["type"]) {
			case "users":
				$users = array();
			    $sql_q = "SELECT * FROM of_users ORDER BY _groups ASC";
		        if (!$sql_res = mysqli_query($conn,$sql_q))echo "[\"err\"]";

				while ($rows = mysqli_fetch_array($sql_res))
					$users[] = '{"id":'.$rows["id"].',"name": "'.$rows["_users"].'","group": '.$rows["_groups"].',"group_name":"'. get_record("of_groups",$rows["_groups"],"_groups").'"}';

				echo '['.implode(",",$users).']';
			break;

            case "getbooks":
				$users = array();
			    $sql_q = "SELECT * FROM of_booking ORDER BY id ASC";
		        if (!$sql_res = mysqli_query($conn,$sql_q))echo "[\"err\"]";

				while ($rows = mysqli_fetch_array($sql_res))
					$books[] = '{"id":'.$rows["id"].',"name": "'.$rows["_name"].'","user": "'.$rows["_user"].'","date": "'.$rows["_date"].'"}';

				echo '['.implode(",",$books).']';
			break;


			 case "offices":
				$users = array();
			    $sql_q = "SELECT * FROM of_offices ORDER BY id ASC";
		        if (!$sql_res = mysqli_query($conn,$sql_q))echo "[\"err\"]";

				while ($rows = mysqli_fetch_array($sql_res))
					$offices[] = '{"id":'.$rows["id"].',"name": "'.$rows["_names"].'"}';

				echo '['.implode(",",$offices).']';
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
                echo '{"status": "'.$rows["_status"].'","useroffice": "'.get_record("of_groups",$rows["_groups"],"offices").'"}';

			break;

			case "delgroup":
				$sql_q = "DELETE FROM of_groups WHERE id='".$_GET["id"]."'";
			    if (!$sql_res = mysqli_query($conn,$sql_q))echo "[\"err\"]";
				else echo "[\"ok\"]";
			break;

			default:
				$groups = array();
			    $sql_q = "SELECT * FROM of_groups ORDER BY offices ASC";
		        if (!$sql_res = mysqli_query($conn,$sql_q))echo "[\"err\"]";

				while ($rows = mysqli_fetch_array($sql_res))
					$groups[] = '{"id":'.$rows["id"].',"name": "'.$rows["_groups"].'","office": "'.get_record("of_offices",$rows["offices"],"_names").'"}';

				echo '['.implode(",",$groups).']';

		}
	}

function get_record($table,$id,$object)
	{
		global $conn;
		 $sql_q="SELECT * FROM $table WHERE id='$id'";
		//print "<br>";
		if (!$sql_res=mysqli_query($conn,$sql_q))print "ERR: ".mysqli_error($conn);
		$rows=mysqli_fetch_array($sql_res);
		$func_res=@$rows[$object];
		return $func_res;
		
	}





?>
