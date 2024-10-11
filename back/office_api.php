<?php
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

  /*
  $user = json_decode(file_get_contents('php://input'), true);

if(isset($user['clogin']) && isset($user['cpassw']))
  */


  $groups = array();

  $sql_q = "SELECT * FROM of_groups ORDER BY id ASC";
  if (!$sql_res = mysqli_query($conn,$sql_q)) print "ERR: ";

  while ($rows = mysqli_fetch_array($sql_res))
  {
    $groups[] = '{"id":'.$rows["id"].',"name": "'.$rows["_groups"].'"}';
  }

  echo '['.implode(",",$groups).']';





?>
