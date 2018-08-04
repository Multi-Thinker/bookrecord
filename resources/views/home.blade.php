<!DOCTYPE html>
<html lang="en">
@include('header')
    <body>
    <div class='container content'>
<form class='shelf'>
  <table>
    <tr>
      <td>
        <label for='title'>Title <span>*</span></label>
      </td>
      <td>
        <input type='text' class='form-control' id='title' name='title' autocomplete="off" required />
        <span style='color:red' class='titleHint hidden'><small>Title field can't be empty</small></span>
      </td>
    </tr>
    <tr>
      <td>
        <label for='author'>Author <span>*</span></label>
      </td>
      <td>
        <input type='text' class='form-control' id='author' name='author' autocomplete="off" required />
        <span style='color:red' class='authorHint hidden'><small>Author field can't be empty</small></span>
        <input type='hidden' name='id' id='id' />
      </td>
    </tr>
  </table>
  <hr>
  <div class='form-group'>
    <label></label>
    <input type='submit' class='btn btn-primary' name='add' id='add' value='Add'>
    <input type='button' class='btn btn-danger hidden' name='cancel' id='cancel' value='Cancel'>
  </div>
</form>
</div>
<div class='container nopd'>
<?php 
  $count   = count($result);
  $table   = '';
  $notFound= 'hidden';
  if($count==0){
    $table   = "hidden";
    $notFound= ''; 
  }
  ?>
<div class="tableContainer {{$table}}">
  <div class='row'>
    <div class='col-md-6 col-sm-6 col-xs-6 col-lg-6'>
    </div>
    <div class='col-md-6 col-sm-6 col-xs-6 col-lg-6'>
      <input type='text' placeholder='search' class='form-control searchTable'>
    </div>
  </div>
  <table class='table table-bordered resultTable ' id="resultTable">
    <thead>
      <tr>
        <th class='title_head'>Title <i class='pull-right fa fa-arrow-up hidden'></i></th>
        <th class='author_head'>Author <i class='pull-right fa fa-arrow-up hidden'></i></th>
        <th class='thcol'>Delete</th>
      </tr>
    </thead>
    <tbody>
        <?php 
        if($count>=1){
        for($i=0;$i<$count;$i++){
        ?>
      <tr data-row='{{$result[$i]["ID"]}}'>
        <td class='title_content'>
          <button class='editor'><i class='fa fa-pencil'></i></button>
          <span class='text'><?=htmlspecialchars_decode($result[$i]['Title'])?></span>
        </td>
        <td class='author_content'>
          <span class='text'><?=htmlspecialchars_decode($result[$i]['Author'])?></span>
        </td>
        <td><button class='deleteBtn'><i class='fa fa-trash'></i></button>
        </td>
      </tr>
        <?php }} ?>
    </tbody>
  </table>
  <div class='inline'>
    <button class='btn btn-success pop'>Download</button>
  </div>
  <div class='popup hidden'>
    <table class='table table-striped table-hover'>
      <tr>
        <th>CSV: </th>
        <td class='pull-right'>
          <a href='/download/csv/title' class='btn btn-primary'>
            <i class='fa fa-arrow-down'></i>  Title
          </a>
        </td>
        <td class='pull-right'>
          <a href='/download/csv/author' class='btn btn-primary'>
            <i class='fa fa-arrow-down'></i>  Author
          </a>
        </td>
        <td class='pull-right'>
          <a href='/download/csv/table' class='btn btn-primary'>
           <i class='fa fa-arrow-down'></i> Table
        </a>
        </td>
      </tr>
      <tr>
        <th>XML: </th>
        <td class='pull-right'>
          <a href='/download/xml/title' class='btn btn-success'>
            <i class='fa fa-arrow-down'></i>  Title
          </a>
        </td>
        <td class='pull-right'>
          <a href='/download/xml/author' class='btn btn-success'>
            <i class='fa fa-arrow-down'></i>  Author
          </a>
        </td>
        <td class='pull-right'>
          <a href='/download/xml/table' class='btn btn-success'>
            <i class='fa fa-arrow-down'></i> Table
          </a>
        </td>
      </tr>
    </table>
  </div>
</div>
<div class='notFound <?=$notFound?>'>
  <h1>Books not found</h1>
</div>
</div>
<a href="/doc/"<div class="corner-ribbon top-right sticky red shadow">Documentation</div>
</a>
<div class='log hidden'></div>
    <script>
        var token = '{{csrf_token()}}';
    </script>
    <script src="{{ url('js/app.js')}}"></script>
</body>
</html>