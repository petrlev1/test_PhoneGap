<?php


header('Access-Control-Allow-Origin: *');



header("Access-Control-Allow-Methods: POST,GET"); // ,OPTION
header("Access-Control-Allow-Headers: content-type");
header("Access-Control-Allow-Headers: NCZ");



// Объявляем нужные константы

/*

define('DB_HOST', 'localhost');
define('DB_USER', 'sitescatya');
define('DB_PASSWORD', 'soprod12');
define('DB_NAME', 'sitescatya');

*/

/*
define('DB_HOST', 'localhost');
define('DB_USER', 'timalevma3');
define('DB_PASSWORD', 'soprod12');
define('DB_NAME', 'timalevma3');
*/



define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASSWORD', '');
define('DB_NAME', 'napitki2');


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


function getMinCount($desc,$name)
{
	if (!preg_match("|([0-9]+) шт|U",$desc, $matches))
	{
		if (!preg_match("|([0-9]+)шт|U",$desc, $matches))
		{
			if (!preg_match("|([0-9]+) шт|U",$name, $matches))
			{
				preg_match("|([0-9]+)шт|U",$name, $matches);
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

	#print_r($matches);
	
	
}

// Получение данных из массива _GET
function getOptions() {
    // Категория, цены и дополнительные данные
    $categoryId = (isset($_GET['category'])) ? (int)$_GET['category'] : 0;
    $minPrice = (isset($_GET['min_price'])) ? (int)$_GET['min_price'] : 0;
    $maxPrice = (isset($_GET['max_price'])) ? (int)$_GET['max_price'] : 1000000;
    $needsData = (isset($_GET['needs_data'])) ? explode(',', $_GET['needs_data']) : array();

    // Бренды
    $brands = (isset($_GET['brands'])) ? implode($_GET['brands'], ',') : null;

	$search = (isset($_GET['search'])) ? trim($_GET['search']) : '';

	$gaz = (isset($_GET['gaz'])) ? trim($_GET['gaz']) : '';

	$steklo = (isset($_GET['steklo'])) ? trim($_GET['steklo']) : '';

    // Сортировка
    $sort = (isset($_GET['sort'])) ? $_GET['sort'] : 'good_asc';
    $sort = explode('_', $sort);
    //$sortBy = "REPLACE('".$sort[0]."','\"','')";

	$sortBy = $sort[0];
    $sortDir = $sort[1];

    return array(
        'brands' => $brands,
		'search' => $search,
		'gaz' => $gaz,
		'steklo'=>$steklo,
        'category_id' => $categoryId,
        'min_price' => $minPrice,
        'max_price' => $maxPrice,
        'sort_by' => $sortBy,
        'sort_dir' => $sortDir,
        'needs_data' => $needsData
    );
}

// Получение товаров
function getGoods($options, $conn) {
    // Обязательные параметры
    $minPrice = $options['min_price'];
    $maxPrice = $options['max_price'];
    $sortBy = $options['sort_by'];
    $sortDir = $options['sort_dir'];

    // Необязательные параметры
    $categoryId = $options['category_id'];
    $categoryWhere =
        ($categoryId !== 0)
            ? " g.category_id = $categoryId and "
            : '';


	$search = $options['search'];
    $searchWhere =
        ($search !="")
            ? " LOWER(g.good) regexp '".mb_strtolower($search,'utf-8')."' and "
            : '';


    $gaz = $options['gaz'];
    $gazWhere =
        ($gaz !="")
            ? " g.good regexp '$gaz' and "
            : '';

	$steklo = $options['steklo'];
    $stekloWhere =
        ($steklo !="")
            ? " g.good regexp '$steklo' and "
            : '';


			

    $brands = $options['brands'];
    $brandsWhere =
        ($brands !== null)
            ? " g.brand_id in ($brands) and "
            : '';


			if (
				isset($_GET['search']) && $_GET['search']!="" ||
				isset($_GET['gaz']) && $_GET['gaz']!="" ||
				isset($_GET['steklo']) && $_GET['steklo']!=""
			
			
			)
	{
				 $query = "
        select
            g.id as good_id,
            g.good as good,
			g.description as description,
			g.sales_notes as sales_notes,
            g.category_id as category_id,
            b.brand as brand,
            g.price as price,
            g.rating as rating,
            g.photo as photo
        from
            goods as g,
            brands as b
        where
            $searchWhere $gazWhere $stekloWhere g.brand_id = b.id  and
            (g.price between $minPrice and $maxPrice)
         order by $sortBy $sortDir
    ";
	}else
	{
		 $query = "
        select
            g.id as good_id,
            g.good as good,
			g.description as description,
			g.sales_notes as sales_notes,
            g.category_id as category_id,
            b.brand as brand,
            g.price as price,
            g.rating as rating,
            g.photo as photo
        from
            goods as g,
            brands as b
        where
            $categoryWhere
            $brandsWhere
            g.brand_id = b.id and
            (g.price between $minPrice and $maxPrice)
         order by $sortBy $sortDir
    ";
	}

   

    $data = $conn->query($query);


    return $data->fetch_all(MYSQLI_ASSOC);
}

// Получаем бренды по категории
function getBrands($categoryId, $conn) {
    if ($categoryId !== 0) {
        $query = "
            select
                distinct b.id as id,
                b.brand as brand,
				(SELECT COUNT(id) 
                      FROM goods 
                      WHERE brand_id = b.id) bc 
            from
                brands as b,
                goods as g
            where
                g.category_id = $categoryId and
                g.brand_id = b.id

				 order by REPLACE(b.brand, '\"','')
        ";
    } else {
        $query = 'select id, brand from brands';
    }
    $data = $conn->query($query);
    return $data->fetch_all(MYSQLI_ASSOC);
}

// Получаем минимальную и максимальную цену
function getPrices($categoryId, $conn) {
    $query = "
        select
            min(price) as min_price,
            max(price) as max_price
        from
            goods
    ";
    if ($categoryId !== 0) {
        $query .= " where category_id = $categoryId";
    }
    $data = $conn->query($query);
    return $data->fetch_assoc();
}

function getCategorys($conn)
{

 $query =  "SELECT c.id, 
                   c.category, 
                     (SELECT COUNT(id) 
                      FROM goods 
                      WHERE category_id = c.id) 
					cc
           FROM categories c";


	  //$query = 'select * from categories, goods WHERE categories.id=goods.category_id';
	   $data = $conn->query($query);
    return $data->fetch_all(MYSQLI_ASSOC);
}



// Получение всех данных
function getData($options, $conn) {
    $result = array(
        'goods' => getGoods($options, $conn)
    );

	$array = array();

	foreach ($result['goods'] as $key=>$value)
	{
		if (getMinCount($value["description"],$value["good"])) 
		{
			$price = $value["price"]*getMinCount($value["description"],$value["good"]); 
		}
		else 
		{
			$price = $value["price"];
		}

		$array["goods"][$key]["good_id"] = $value["good_id"];
		$array["goods"][$key]["good"] = $value["good"];
		$array["goods"][$key]["description"] = $value["description"];
		$array["goods"][$key]["sales_notes"] = $value["sales_notes"];
		$array["goods"][$key]["category_id"] = $value["category_id"];
		$array["goods"][$key]["brand"] = $value["brand"];
		$array["goods"][$key]["price"] = $value["price"];
		$array["goods"][$key]["mprice"] = $price;
		$array["goods"][$key]["rating"] = $value["rating"];
		$array["goods"][$key]["photo"] = $value["photo"];
	//$array["goods"][$key]["search"] = trim($_GET["search"]);

	}

	$result = $array;





    $needsData = $options['needs_data'];
    if (empty($needsData)) return $result;

    if (in_array('brands', $needsData)) {
        $result['brands'] = getBrands($options['category_id'], $conn);
    }
	if (in_array('categorys', $needsData)) {
        $result['categorys'] = getCategorys($conn);
    }
    if (in_array('prices', $needsData)) {
        $result['prices'] = getPrices($options['category_id'], $conn);
    }

    return $result;
}


try {
    // Подключаемся к базе данных
    $conn = connectDB();

    // Получаем данные от клиента
    $options = getOptions();

    // Получаем товары
    $data = getData($options, $conn);

    // Возвращаем клиенту успешный ответ

	//print_r($data);



	
		//print_r($array);
	

    echo json_encode(array(
        'code' => 'success',
        'data' => $data,
		'search' =>$_GET['search']
    ));


}
catch (Exception $e) {
    // Возвращаем клиенту ответ с ошибкой
    echo json_encode(array(
        'code' => 'error',
        'message' => $e->getMessage()
    ));
}
