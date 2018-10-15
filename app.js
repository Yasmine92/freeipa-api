#!/usr/bin/env node

// This one file app serves as a rest api for the FreeIpa Software
// It relies on the inrenal api used by the web Graphical interface
// static includes wrapped by the HTML comments like this:
//
// Author: Yasmine El Wahbi
// Version: 0.5.0 (2014/05/26)
var restify = require('restify');
var http = require('http');
var curl = require('/root/node_modules/curl-cmd/curl-cmd.js');
var sys = require('sys')
var exec = require('child_process').exec; 
var ip_addr = '192.168.1.129';
var port    =  '4848';
 
var server = restify.createServer({
    name : "myapp"
});
 
server.use(restify.queryParser());
server.use(restify.bodyParser());
server.use(restify.CORS());
//var sessid='test';
var PATH = '/users'
var PATHR='/roles'
server.get({path : PATH , version : '0.0.1'} , findAllUsers);
server.get({path : PATH +'/:user' , version : '0.0.1'} , findUser);
server.put({path : PATH , version: '0.0.1'} ,addNewUser);
server.del({path : PATH +'/:user' , version: '0.0.1'} ,deleteUser);
server.post({path : PATH +'/:user', version: '0.0.1'} ,enableUser);
server.get({path : PATHR , version: '0.0.1'} ,listRoles);
server.post({path : PATHR +'/:user', version: '0.0.1'} ,attributeRole);
server.get({path : '/rules', version: '0.0.1'} ,hbacruleShow);
server.post({path : '/rules'+'/:rule', version: '0.0.1'} ,hbacruleEnable);




      	var optsess={
          hostname: 'server.freeipa',
          path: '/ipa/session/login_password',
          method: 'POST',
          headers: {
            'referer':'https://server.freeipa/ipa/ui',
            'Content-Type':'application/x-www-form-urlencoded',
            'Accept':'*/*'
          },
         negotiate: '-u :',
         cacert: '/etc/ipa/ca.crt',
         data:  'user=USER',
         data2: 'password=PASSWORD'
        };

        var curlopts={
        verbose: true
        };



function findAllUsers(req, res , next){
	 function puts(error, stdout, stderr) {
       	res.setHeader('Access-Control-Allow-Origin','*');
	var str = stdout.toString();
	str = JSON.parse(str);
	res.send(200, str);
	//console.log(stdout);
        // res.send(JSON.stringify(stdout));
	//res.send(stdout);

	    if (error !== null) {
	      res.send(200, error);
	    } }


	
		
        console.log('=> %s', curl.cmd(optsess,curlopts));
	
	

	exec(curl.cmd(optsess,curlopts),function(error, stdout, stderr) {
        var sessid ="ipa_session="+stderr.split("ipa_session=")[1].split("; ")[0];
	var options = {
          hostname: 'server.freeipa',
          path: '/ipa/session/json',
          method: 'POST',
          headers: {
            'referer': 'https://server.freeipa/ipa',
            'Content-Type':'application/json',
            'Accept':'application/json'
          },
         negotiate: '-u :',
         cacert: '/etc/ipa/ca.crt',
         cookie: sessid,
         data:  '{"method":"user_find","params":[[""],{}],"id":0}'
        };

	console.log('this is sessid=> %s', sessid);
        exec(curl.cmd(options), puts);
	console.log('=> %s', curl.cmd(options));
        //callback(sessid);

	 });
	//console.log('this is sessid=> %s', sessid);

}
 


function findUser(req, res , next){
         function puts(error, stdout, stderr) {
        res.setHeader('Access-Control-Allow-Origin','*');
        var str = stdout.toString();
        str = JSON.parse(str);
        res.send(200, str);

	// res.send(JSON.stringify(stdout));
        //res.send(stdout);

            if (error !== null) {
              res.send(200, error);
            } }
	 console.log('=> %s', curl.cmd(optsess,curlopts));



        exec(curl.cmd(optsess,curlopts),function(error, stdout, stderr) {
        var sessid ="ipa_session="+stderr.split("ipa_session=")[1].split("; ")[0];
        var options = {
          hostname: 'server.freeipa',
          path: '/ipa/session/json',
          method: 'POST',
          headers: {
            'referer': 'https://server.freeipa/ipa',
            'Content-Type':'application/json',
            'Accept':'application/json'
          },
         negotiate: '-u :',
         cacert: '/etc/ipa/ca.crt',
         cookie: sessid,
	data: '{"method":"batch","params":[[{"method":"user_show","params":[["'+req.params.user+'"],{"all":false,"rights":true}]},{"method":"user_status","params":[["'+req.params.user+'"],{}]}],{}]}'
	//data:  '{"method":"user_status","params":[["'+req.params.user+'"],{}]}'
       
	 };

        console.log('this is sessid=> %s', sessid);
        exec(curl.cmd(options), puts);
        console.log('=> %s', curl.cmd(options));

        //callback(sessid);

         });
        //console.log('this is sessid=> %s', sessid);

}
 



function addNewUser(req, res , next){
         function puts(error, stdout, stderr) {
        res.setHeader('Access-Control-Allow-Origin','*');
	var str = stdout.toString();
        str = JSON.parse(str);
        res.send(200, str);

            if (error !== null) {
              res.send(200, error);
            } }
	 console.log('=> %s', curl.cmd(optsess,curlopts));



        exec(curl.cmd(optsess,curlopts),function(error, stdout, stderr) {
        var sessid ="ipa_session="+stderr.split("ipa_session=")[1].split("; ")[0];
        var options = {
          hostname: 'server.freeipa',
          path: '/ipa/session/json',
          method: 'POST',
          headers: {
            'referer': 'https://server.freeipa/ipa',
            'Content-Type':'application/json',
            'Accept':'application/json'
          },
         negotiate: '-u :',
         cacert: '/etc/ipa/ca.crt',
         cookie: sessid,
         data:  '{"method":"user_add","params":[["'+req.params.login+'"],{"givenname":"'+req.params.nom+'","sn":"'+req.params.prenom+'","userpassword":"'+req.params.password+'"}]}' 
        };

        console.log('this is sessid=> %s', sessid);
        exec(curl.cmd(options), puts);
        console.log('=> %s', curl.cmd(options));
        //callback(sessid);

         });
        //console.log('this is sessid=> %s', sessid);

}



function deleteUser(req, res , next){
         function puts(error, stdout, stderr) {
        res.setHeader('Access-Control-Allow-Origin','*');
	var str = stdout.toString();
        str = JSON.parse(str);
        res.send(200, str);

            if (error !== null) {
              res.send(200, error);
            } }
	 console.log('=> %s', curl.cmd(optsess,curlopts));



        exec(curl.cmd(optsess,curlopts),function(error, stdout, stderr) {
        var sessid ="ipa_session="+stderr.split("ipa_session=")[1].split("; ")[0];
        var options = {
          hostname: 'server.freeipa',
          path: '/ipa/session/json',
          method: 'POST',
          headers: {
            'referer': 'https://server.freeipa/ipa',
            'Content-Type':'application/json',
            'Accept':'application/json'
          },
         negotiate: '-u :',
         cacert: '/etc/ipa/ca.crt',
         cookie: sessid,
	data: '{"method":"batch","params":[[{"method":"user_del","params":[["'+req.params.user+'"],{}]}],{}]}' 
        };

        console.log('this is sessid=> %s', sessid);
        exec(curl.cmd(options), puts);
        console.log('=> %s', curl.cmd(options));
        //callback(sessid);

         });
        //console.log('this is sessid=> %s', sessid);

}



function enableUser(req, res , next){
         function puts(error, stdout, stderr) {
        res.setHeader('Access-Control-Allow-Origin','*');
         res.send(200, stdout.replace(/ /g,'').replace(/\\/g,'').split("\n"));
	 var str = stdout.toString();
        str = JSON.parse(str);
        res.send(200, str);

           if (error !== null) {
             res.send(200, error);
            } }
	 console.log('=> %s', curl.cmd(optsess,curlopts));



        exec(curl.cmd(optsess,curlopts),function(error, stdout, stderr) {
        var sessid ="ipa_session="+stderr.split("ipa_session=")[1].split("; ")[0];




        var options = {
          hostname: 'server.freeipa',
          path: '/ipa/session/json',
          method: 'POST',
          headers: {
            'referer': 'https://server.freeipa/ipa',
            'Content-Type':'application/json',
            'Accept':'application/json'
          },
         negotiate: '-u :',
         cacert: '/etc/ipa/ca.crt',
         cookie: sessid,
	data: '{"method":"batch","params":[[{"method":"user_'+req.params.state+'","params":[["'+req.params.user+'"],{}]}],{}]}' 
        };

        console.log('this is sessid=> %s', sessid);
        exec(curl.cmd(options), puts);
        console.log('=> %s', curl.cmd(options));
        //callback(sessid);

         });
        //console.log('this is sessid=> %s', sessid);

}

function listRoles(req, res , next){
         function puts(error, stdout, stderr) {
        res.setHeader('Access-Control-Allow-Origin','*');
         var str = stdout.toString();
        str = JSON.parse(str);
        res.send(200, str);


            if (error !== null) {
              res.send(200, error);
            } }
	 console.log('=> %s', curl.cmd(optsess,curlopts));



        exec(curl.cmd(optsess,curlopts),function(error, stdout, stderr) {
        var sessid ="ipa_session="+stderr.split("ipa_session=")[1].split("; ")[0];




        var options = {
          hostname: 'server.freeipa',
          path: '/ipa/session/json',
          method: 'POST',
          headers: {
            'referer': 'https://server.freeipa/ipa',
            'Content-Type':'application/json',
            'Accept':'application/json'
          },
         negotiate: '-u :',
         cacert: '/etc/ipa/ca.crt',
         cookie: sessid,

         data: '{"method":"role_find","params":[[null],{"pkey_only":true,"sizelimit":0}]}' 
	};

        console.log('this is sessid=> %s', sessid);
        exec(curl.cmd(options), puts);
        console.log('=> %s', curl.cmd(options));
        //callback(sessid);

         });
        //console.log('this is sessid=> %s', sessid);

}



function attributeRole(req, res , next){
         function puts(error, stdout, stderr) {
        res.setHeader('Access-Control-Allow-Origin','*');
	var str = stdout.toString();
        str = JSON.parse(str);
        res.send(200, str);

            if (error !== null) {
              res.send(200, error);
            } }
	 console.log('=> %s', curl.cmd(optsess,curlopts));



        exec(curl.cmd(optsess,curlopts),function(error, stdout, stderr) {
        var sessid ="ipa_session="+stderr.split("ipa_session=")[1].split("; ")[0];




        var options = {
          hostname: 'server.freeipa',
          path: '/ipa/session/json',
          method: 'POST',
          headers: {
            'referer': 'https://server.freeipa/ipa',
            'Content-Type':'application/json',
            'Accept':'application/json'
          },
         negotiate: '-u :',
         cacert: '/etc/ipa/ca.crt',
         cookie: sessid,
	data: '{"method":"batch","params" :[[{"method":"role_'+req.params.action+'_member","params" :[["'+req.params.role+'"],{"user":"'+req.params.user+'"}]}],{}]}'
	};

        console.log('this is sessid=> %s', sessid);
        exec(curl.cmd(options), puts);
        console.log('=> %s', curl.cmd(options));
        //callback(sessid);

         });
        //console.log('this is sessid=> %s', sessid);

}

//lister les règles HBAC

function hbacruleShow(req, res , next){
         function puts(error, stdout, stderr) {
        res.setHeader('Access-Control-Allow-Origin','*');
	var str = stdout.toString();
        str = JSON.parse(str);
        res.send(200, str);

            if (error !== null) {
              res.send(200, error);
            } }
	 console.log('=> %s', curl.cmd(optsess,curlopts));



        exec(curl.cmd(optsess,curlopts),function(error, stdout, stderr) {
        var sessid ="ipa_session="+stderr.split("ipa_session=")[1].split("; ")[0];




        var options = {
          hostname: 'server.freeipa',
          path: '/ipa/session/json',
          method: 'POST',
          headers: {
            'referer': 'https://server.freeipa/ipa',
            'Content-Type':'application/json',
            'Accept':'application/json'
          },
         negotiate: '-u :',
         cacert: '/etc/ipa/ca.crt',
         cookie: sessid,
	data: '{"method":"hbacrule_find","params":[[null],{"pkey_only":true,"sizelimit":0}]}'
	};

        console.log('this is sessid=> %s', sessid);
        exec(curl.cmd(options), puts);
        console.log('=> %s', curl.cmd(options));
        //callback(sessid);

         });
        //console.log('this is sessid=> %s', sessid);

}


// activer ou désactiver yne règle HBAC
//url: http://192.168.1.129:4848/rules/rule
//méthode: post
//params: action:{enable, disable} 
function hbacruleEnable(req, res , next){
         function puts(error, stdout, stderr) {
        res.setHeader('Access-Control-Allow-Origin','*');
	var str = stdout.toString();
        str = JSON.parse(str);
        res.send(200, str);

            if (error !== null) {
              res.send(200, error);
            } }
	 console.log('=> %s', curl.cmd(optsess,curlopts));



        exec(curl.cmd(optsess,curlopts),function(error, stdout, stderr) {
        var sessid ="ipa_session="+stderr.split("ipa_session=")[1].split("; ")[0];




        var options = {
          hostname: 'server.freeipa',
          path: '/ipa/session/json',
          method: 'POST',
          headers: {
            'referer': 'https://server.freeipa/ipa',
            'Content-Type':'application/json',
            'Accept':'application/json'
          },
         negotiate: '-u :',
         cacert: '/etc/ipa/ca.crt',
         cookie: sessid,
	data: '{"method":"batch","params":[[{"method":"hbacrule_'+req.params.action+'","params":[["allow"],{}]}],{}]}'

	};

        console.log('this is sessid=> %s', sessid);
        exec(curl.cmd(options), puts);
        console.log('=> %s', curl.cmd(options));
        //callback(sessid);

         });
        //console.log('this is sessid=> %s', sessid);

}





server.listen(port ,ip_addr, function(){
    console.log('%s listening at %s ', server.name , server.url);
});


