var util = require("util");
var helpers = require("../helpers");
var Policy = require("../s3post").Policy;
var S3Form = require("../s3post").S3Form;
var AWS_CONFIG_FILE = "config.json";
var POLICY_FILE = "policy.json";
var INDEX_TEMPLATE = "index.ejs";
var ACCESS_KEY_FIELD_NAME = "AWSAccessKeyId";
var POLICY_FIELD_NAME = "policy";
var SIGNATURE_FIELD_NAME = "signature";

var task = function(request, callback){
	//1. load configuration
	var awsConfig = helpers.readJSONFile(AWS_CONFIG_FILE);
	var policyData = helpers.readJSONFile(POLICY_FILE);
	

	//2. prepare policy
	var policy = new Policy(policyData);

	//3. generate form fields for S3 POST
	var s3Form = new s3From(policy);
	
	var fields = s3Form.generateS3FormFields();
	
	fields.push(s3Forms.addHiddenField(ACCESS_KEY_FIELD_NAME, awsConfig.AccessKeyId));

	fields.push(s3Forms.addHiddenField(POLICY_FIELD_NAME, policy.generateEncodedPolicyDocument));
	
	fields.push(s3Forms.addHiddenField(SIGNATURE_FIELD_NAME, policy.generateSignature(awsConfig.secretAccessKey)));
	//4. get bucket name
	var bucket = policy.getConditionalValueByKey("bucket");

	callback(null, {template: INDEX_TEMPLATE, params:{fields:[], bucket:""}});
}

exports.action = task;
