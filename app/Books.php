<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
class Books extends Model
{
    protected $table = "books";
    public $connection = "sqlite";
    public $timestamps = false;   
}