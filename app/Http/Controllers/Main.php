<?php

namespace App\Http\Controllers;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Books;

class Main extends Controller
{
    public function index(){
        $record['result'] = Books::all();
        return view("home")->with($record);
    }
    public function add(Request $param){
        $title  = $this->dbIN($param->input('title'));
        $author = $this->dbIN($param->input("author"));
        if($title!='' && $author!=''){
            echo Books::insertGetId(array("Title"=>$title,"Author"=>$author));
        }else{
            die();   
        }
    }
    public function delete(Request $param){
        $id = $param->input("id");
        Books::where('ID', '=', $id)->delete();
    }
    public function update(Request $param){
        $id     = $param->input("id");
        $title  = $this->dbIN($param->input('title'));
        $author = $this->dbIN($param->input("author"));
        Books::where(array("ID"=>$id))->update(array("Title"=>$title,"Author"=>$author));
    }
    public function download($type,$selection)
        {
            $type = strtolower($type);
            $selection = strtolower($selection);
            $this->selection($selection,$type);
        }
    function selection($name,$type){
        $name = strtolower($name);
        if($name=="table"){
            $list = Books::all()->toArray();
        }else{
            $list = Books::pluck(ucfirst($name))->toArray();
        }
        $this->generateDownload($list,$name,$type);
    }    
    function generateDownload(array &$array,$filename,$type){
        if (count($array) == 0) {
            return null;
        }
        $handle = 0;
        if($filename!='table'){
            $handle=1;
        }
        $ext = "csv";
        if($type!=$ext){
            $type = $type;
        }
        // disable caching
        $now = gmdate("D, d M Y H:i:s");
        header("Expires: Tue, 03 Jul 2001 06:00:00 GMT");
        header("Cache-Control: max-age=0, no-cache, must-revalidate, proxy-revalidate");
        header("Last-Modified: {$now} GMT");
     
        // force download 
        header("Content-type: text/{$type}"); 
        header("Content-Type: application/force-download");
        header("Content-Type: application/octet-stream");
        header("Content-Type: application/download");
     
        // disposition / encoding on response body
        header("Content-Disposition: attachment;filename={$filename}.{$type}");
        header("Content-Transfer-Encoding: binary");

        if($handle){
            $newAr = array();
            foreach($array as $a){
                $newAr[][$filename] = $a;
            }
            $array = $newAr;
        }
        if($type=="csv"){
            $df = fopen("php://output", 'w');
            fputcsv($df, array_keys(reset($array)),",");
            foreach ($array as $k => $row) {
                $newAr = array_map(function($row){
                        return $this->dbOUT($row);
                },$row);
                // print_r($newAr);
                fputcsv($df, $row,",");
            }
            fclose($df);
        }else{
            echo '<?xml version="1.0" encoding="UTF-8"?>';            
            echo "<records>";
            foreach($array as $node => $value){
                $k = ++$node;
                echo "<record ID='$k'>";
                foreach($value as $key => $text){
                   echo "<{$key}>".$this->dbOut($text)."</{$key}>";
                }                
                echo "</record>";
            }
            echo "</records>";
        }
        die();   
    }
    function dbOut($string){
        return htmlspecialchars_decode(urldecode(html_entity_decode($string)));
    }
    function dbIN($string){
        return htmlspecialchars(urldecode($string));
    }
    
}