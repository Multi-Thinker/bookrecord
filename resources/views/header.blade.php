<head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Laravel example | Suguru Sakanishi</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}" />
    <link rel="stylesheet" type='text/css' href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.1.2/css/bootstrap.min.css">
    <link rel='stylesheet' type='text/css' href='https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css'>
    <link rel="stylesheet" type="text/css" media="screen" href="{{ url('css/style.css') }}" />
    <style>
        @media (max-width: 450px) {
            table.table-bordered thead {
                --cols: <?=3*count($result)?>;
                --height: calc(1.67em * var(--cols));
                text-shadow: 0 var(--height), 0 calc(var(--height) * 2), 0 calc(var(--height) * 3), 0 calc(var(--height) * 4);
            }
        }
    </style>
</head>
