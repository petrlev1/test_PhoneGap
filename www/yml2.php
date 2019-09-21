<?php


session_start();

header('Access-Control-Allow-Origin: *');



header("Access-Control-Allow-Methods: POST,GET"); // ,OPTION
header("Access-Control-Allow-Headers: content-type");
header("Access-Control-Allow-Headers: NCZ");

header("Content-type: text/json;charset=utf-8");
date_default_timezone_set('France/Paris');


$data = simplexml_load_file('mosnapitki.ru.xml');



define('DB_HOST', 'localhost');
define('DB_USER', 'u0351947_timalev');
define('DB_PASSWORD', 'soprod12');
define('DB_NAME', 'u0351947_mosnapitki');

// Подключаемся к базе данных
function connectDB() {
    $errorMessage = 'Невозможно подключиться к серверу базы данных';
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME);
    if (!$conn)
        throw new Exception($errorMessage);
    else {
        $query = $conn->query('set names utf8');
        if (!$query)
            throw new Exception($errorMessage);
        else
            return $conn;
    }
}

$conn = connectDB();

//var_dump($data);

//print $data->shop->offers->offer->url;


//var_dump($data->shop->offers);


// print count($data->shop->offers);

foreach ($data->shop->categories->category as $category) {

	//print $offer->url;

	//print $offer->picture;

	//print $offer->price;
	//print " / ";

	//print $offer['id'];

	
	//print "<br>";

	//print $offer->categoryId;

	if ($category['parentId']==""){


		$sql_q = "INSERT INTO categories (id,category) VALUES ('$category[id]','$category')";

		if (!$sql_res = mysqli_query($conn,$sql_q)) print "ERR: ".mysqli_error($conn);


	//echo "\n";

	}

/*
	if ($offer->categoryId==3474)
	{
	$array[] = "  \n{\n".
	
	"\"id\": \"".$offer['id']."\",\n".
        "\"name\": \"".$offer->name."\",\n".
		"\"description\": \"".$offer->description."\",\n".
		"\"sales_notes\": \"".$offer->sales_notes."\",\n".
        "\"price\": \"".$offer->price."\",\n".
        "\"img\": \"".$offer->picture."\"\n".

	"}";
	}
	*/
}

//print "\n\n\n";

foreach ($data->shop->categories->category as $category) {

	//print $offer->url;

	//print $offer->picture;

	//print $offer->price;
	//print " / ";

	//print $offer['id'];

	
	//print "<br>";

	//print $offer->categoryId;

	if ($category['parentId']!=""){


		 $sql_q = "INSERT INTO brands (id, brand, parentid) VALUES ('$category[id]','".trim($category)."','$category[parentId]')";

		 if (!$sql_res = mysqli_query($conn,$sql_q)) print "ERR: ".mysqli_error($conn);


	//echo "\n";

	}

}



foreach ($data->shop->categories->category as $category) {

	//print $offer->url;

	//print $offer->picture;

	//print $offer->price;
	//print " / ";

	//print $offer['id'];

	
	//print "<br>";

	//print $offer->categoryId;

	if ($category['parentId']==""){


		//echo $sql_q = "INSERT INTO categories (id,category) VALUES ('$category[id]','$category')";

		//print $category["id"];
		//print "\n";

	


		if (check_brand($category["id"],$conn)==0)
		{
			 $sql_q6 = "INSERT INTO brands (id, brand, parentid) VALUES ('$category[id]','$category','$category[id]')";

			  if (!$sql_res6 = mysqli_query($conn,$sql_q6)) print "ERR: ".mysqli_error($conn);

		}
	

	}

}




//echo "[\n".implode(",",$array)."\n]";



foreach ($data->shop->offers->offer as $row) {



 $id = intval($row['id']);


    $categoryId = intval($row->categoryId);


    $price = strval($row->price);    


    $name = str_replace("'","`",strval($row->name));    

    $url = strval($row->url);


    $picture = strval($row->picture);
    
   
    $description = str_replace("'","`",strval($row->description));

    $sales_notes = str_replace("'","`",strval($row->sales_notes));

	if (get_category($categoryId,$conn)!="")
	{
		
		if (getMinCount($description,$name)) 
		{
			$newprice = $price*getMinCount($description,$name); 
		}
		else 
		{
			$newprice = $price;
		}

 


	$sql_q3 = "INSERT INTO goods (id,good,goodtech,description,sales_notes,category_id,brand_id,price,oprice,photo) VALUES ('$id','$name','".str_replace("\"","",mb_strtolower($name,'utf-8'))."','".trim($description)."','".trim($sales_notes)."','".get_category($categoryId,$conn)."','$categoryId','$newprice','$price','$picture')";
    if (!$sql_res3 = mysqli_query($conn,$sql_q3)) print "ERR: ".mysqli_error($conn);

	//echo "\n";

	}
    
}




$sql_q5 = mysqli_query($conn,"SELECT * FROM brands");
while ($rows5 = mysqli_fetch_array($sql_q5))
{
	if (get_photo($rows5["id"],$conn)!="")
	{
		$sql_q6 = "UPDATE brands SET photo='".get_photo($rows5["id"],$conn)."' WHERE id='".$rows5["id"]."'";
		
		if (!$sql_res6 = mysqli_query($conn,$sql_q6)) print "ERR: ".mysqli_error($conn);
		//print "\n";
	}
}


$sql_q7 = mysqli_query($conn,"SELECT * FROM categories");
while ($rows7 = mysqli_fetch_array($sql_q7))
{
	if (get_photo_cat($rows7["id"],$conn)!="")
	{
		$sql_q8 = "UPDATE categories SET photo='".get_photo_cat($rows7["id"],$conn)."' WHERE id='".$rows7["id"]."'";
		if (!$sql_res8 = mysqli_query($conn,$sql_q8)) print "ERR: ".mysqli_error($conn);
		//print "\n";
	}
}




foreach ($data->shop->offers->offer as $row) {

	

	 $categoryId = intval($row->categoryId);



if (get_category($categoryId,$conn)!="")
	{

	if (strval($row->picture)=="https://mosnapitki.ru/files/century_cedrata_7cm.jpg" || strval($row->picture)=="https://mosnapitki.ru/files/elivo_zz_red_500x490_but.jpg")
		{

   $picture = strval($row->picture);

   $tp = str_replace("https://mosnapitki.ru/","",$picture);

   $tp_arr = explode("/",$tp);

   $pic_name = end($tp_arr);
    
	//get_pics (trim($picture),$pic_name);

  //  add_photo2($picture,$pic_name);
		}

	//echo "\n";

	}


}


function getMinCount($desc,$name)
{
	if (!preg_match("|([0-9]+) шт|U",$desc, $matches))
	{
		if (!preg_match("|([0-9]+)шт|U",$desc, $matches))
		{
			if (!preg_match("|([0-9]+) шт|U",$name, $matches))
			{
				if (!preg_match("|([0-9]+)шт|U",$name, $matches))
				{
					preg_match("|([0-9]+) бутылок|U",$desc, $matches);
					return $matches[1];
				}
				else
				{
					return $matches[1];
				}
			}
		    else
			{
				return $matches[1];
			}
		}
		else
		{
			return $matches[1];
		}
	}
	else
	{
			return $matches[1];
	}

	#print_r($matches);
	
	
}


function get_pics($source,$pic_name)
{

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $source);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_SSLVERSION,3);
$data = curl_exec ($ch);
$error = curl_error($ch); 
curl_close ($ch);

$destination = 'img/goods/'.$pic_name;
$file = fopen($destination, "w+");
fputs($file, $data);
fclose($file);
}

function add_photo2($photo,$pic_name)
	{

		print $photo;
	  
					  $img_path = 'img/goods/'.$pic_name;

					  if (file_exists($img_path)) unlink($img_path);
					  
					  $ch = curl_init($photo);
					  
					  $fp2 = fopen($img_path, 'wb');
					  
					  curl_setopt($ch, CURLOPT_FILE, $fp2);
					  curl_setopt($ch, CURLOPT_SSLVERSION,3);
					  curl_setopt($ch, CURLOPT_HEADER, 0);
					  curl_exec($ch);
					  curl_close($ch);
					  fclose($fp2);
					  

			
						  

	}

function check_brand($id,$conn)
{
	$sql_q7 = mysqli_query($conn,"SELECT COUNT(id) AS 'tc' FROM brands WHERE parentid='$id'");

	if (!$sql_q7) {
    printf("Error: %s\n", mysqli_error($conn));
    exit();
}


	$rows7 = mysqli_fetch_array($sql_q7);

   //echo $rows7['tc']." / ".$id;
   //echo "\n";

	return $rows7['tc'];
}



function get_category($categoryId,$conn)
{

	//print "SELECT parentid FROM brands WHERE id='$categoryId'";
	//print "\n";

	$sql_q = mysqli_query($conn,"SELECT * FROM brands WHERE id='$categoryId'");
    $rows = mysqli_fetch_array($sql_q);

	return $rows['parentid'];

}

function get_photo($id,$conn)
{
	$sql_q = mysqli_query($conn,"SELECT * FROM goods WHERE brand_id='$id' ORDER BY good ASC");

	 $rows = mysqli_fetch_array($sql_q);

	return $rows['photo'];
}

function get_photo_cat($id,$conn)
{
	$sql_q = mysqli_query($conn,"SELECT * FROM goods WHERE category_id='$id' ORDER BY good ASC");

	 $rows = mysqli_fetch_array($sql_q);

	return $rows['photo'];
}




?>