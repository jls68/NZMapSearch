<?php
    $request = 'https://api.openweathermap.org/data/2.5/weather?appid=ab695e6c7c565b6b366084f25c11d141&mode=xml&lat='.$_GET['lat'].'&lon='.$_GET['lng'];
    $connection = curl_init($request);
    //curl_setopt($connection, CURLOPT_RETURNTRANSFER, true);
    $response = curl_exec($connection);
    curl_close($connection);
    $xml = simplexml_load_string($response);
    echo $xml;
?>
   
	


