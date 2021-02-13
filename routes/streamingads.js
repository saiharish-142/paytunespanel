		var streamingadObj = require('../models/streamingads.model');
		var campaignwisereportObj = require('../models/campaignwisereports.model');
		var datewisereportObj = require('./../../models/datewisereports/datewisereports.js');
		var adrequestObj = require('./../../models/adrequests/adrequests.js');
		var publisherappObj = require('./../../models/publisherapps/publisherapps.js');
		var phonemakereportObj = require('./../../models/computereport/phonemakereports.js');
		var phonemodelreportObj = require('./../../models/computereport/phonemodelreports.js');
		var platformtypereportObj = require('./../../models/computereport/platformtypereports.js');
		var pptypereportObj = require('./../../models/computereport/pptypereports.js');
		var citylanguagereportObj = require('./../../models/computereport/citylanguagereports.js');
		var bundlenamereportObj = require('./../../models/computereport/bundlenamereports.js');
		var campaignifareportObj = require('./../../models/computereport/campaignifareports.js');
		var regionreportObj = require('./../../models/computereport/regionreports.js');
		var zipreportObj = require('./../../models/computereport/zipreports.js');

		
		var mongoose = require('mongoose');
		var constantObj = require('./../../../constants.js');
		const fs = require('fs');
		var http = require('http');
		var url = require('url');
		/**
		 * Find streamingad by id
		 * Input: streamingad ID
		 * Output: streamingad json object
		 * This function gets called automatically whenever we have a streamingad id parameter in route. 
		 * It uses load function which has been define in streamingad model after that passes control to next calling function.
		 */
		exports.streamingad = function(req, res, next, id) {
		    streamingadObj.load(id, function(err, streamingad) {
		        if (err) {
		            res.jsonp(err);
		        } else if (!streamingad) {
		            res.jsonp({ err: 'Failed to load rbt campaign ' + id });
		        } else {
		            req.streamingad = streamingad;
		            next();
		        }
		    });
		};

		/**
		 * Show streamingad by id
		 * Input: streamingad json object
		 * Output: streamingad json object
		 * This function gets streamingad json object from exports.campaign 
		 */
		exports.findOne = function(req, res) {
		    if (!req.streamingad) {
		        outputJSON = { 'status': 'failure', 'messageId': 203, 'message': constantObj.messages.errorRetreivingData };
		    } else {
		        outputJSON = {
		            'status': 'success',
		            'messageId': 200,
		            'message': constantObj.messages.successRetreivingData,
		            'data': req.streamingad
		        }
		    }
		    res.jsonp(outputJSON);
		};

		/**
		 * List all streamingad object
		 * Input: 
		 * Output: streamingad json object
		 */
		exports.list = function(req, res) {
		    var outputJSON = "";
		    streamingadObj.find({}, function(err, data) {
		        if (err) {
		            outputJSON = { 'status': 'failure', 'messageId': 203, 'message': constantObj.messages.errorRetreivingData };
		        } else {
		            outputJSON = {
		                'status': 'success',
		                'messageId': 200,
		                'message': constantObj.messages.successRetreivingData,
		                'data': data
		            }
		        }
		        res.jsonp(outputJSON);
		    });
		}

		/**
		 * Create new streamingad object
		 * Input: streamingad object
		 * Output: streamingad json object with success
		 */
		uploadRO = function(data, callback) {
		        var filetype = data.filetype;
		        var photoname = data._id + '_' + Date.now() + '.' + filetype;
		        var folder = "";
		        var updateField = {
		            'file': photoname
		        };
		        var height = 125;
		        var width = 125;
		        var imagename = constantObj.uploadPath.path + photoname;
		        //"/Applications/framework/uploads/" + folder + photoname;
		       // var imagename =  "/Applications/paytunesmusicadsstaging/uploads/" + folder + photoname;
		        var b64string = data.file;
		        if (typeof Buffer.from === "function") {
		            buf = Buffer.from(b64string, 'base64'); // Ta-da
		        } else {
		            buf = new Buffer(b64string, 'base64'); // Ta-da
		        }
		        if (buf != undefined) {
		            var Data = b64string; //data.file.split('base64,');
		            var base64Data = b64string; //Data[1];
		            fs.writeFile(imagename, base64Data, 'base64', function(err) {
		                if (err) {
		                    callback("Failure Upload");
		                } else {
		                    callback(updateField);
		                }
		            });
		        } else {
		            callback("Image  not selected");
		        }
		    }
		exports.add = function(req, res) {
		    var errorMessage = "";
		    var outputJSON = "";
		    var streamingadModelObj = {};
		    streamingadModelObj = req.body;
		    if (req.body.filedata != undefined && req.body.filedata != '') {
		        reqdata = {};
		        reqdata._id = '0';
		        reqdata.file = req.body.filedata;
		        reqdata.filetype = req.body.filetype;
		        uploadRO(reqdata, function(responce) {
		        	streamingadModelObj.attchedRO=responce.file;
		    streamingadObj(streamingadModelObj).save(req.body, function(err, data) {
		        if (err) {
		            switch (err.name) {
		                case 'ValidationError':
		                    for (field in err.errors) {
		                        if (errorMessage == "") {
		                            errorMessage = err.errors[field].message;
		                        } else {
		                            errorMessage += ", " + err.errors[field].message;
		                        }
		                    } //for
		                    break;
		            } //switch
		            outputJSON = { 'status': 'failure', 'messageId': 401, 'message': errorMessage };
		        } //if
		        else {
		            outputJSON = { 'status': 'success', 'messageId': 200, 'message': constantObj.messages.streamingadSuccess, 'data': data };
		        }
		        res.jsonp(outputJSON);

		    });
		        });
		    } else {
		    streamingadObj(streamingadModelObj).save(req.body, function(err, data) {
		        if (err) {
		            switch (err.name) {
		                case 'ValidationError':
		                    for (field in err.errors) {
		                        if (errorMessage == "") {
		                            errorMessage = err.errors[field].message;
		                        } else {
		                            errorMessage += ", " + err.errors[field].message;
		                        }
		                    } //for
		                    break;
		            } //switch
		            outputJSON = { 'status': 'failure', 'messageId': 401, 'message': errorMessage };
		        } //if
		        else {
		            outputJSON = { 'status': 'success', 'messageId': 200, 'message': constantObj.messages.streamingadSuccess, 'data': data };
		        }
		        res.jsonp(outputJSON);
		    });
		}

		}

		/**
		 * Update streamingad object
		 * Input: streamingad object
		 * Output: streamingad json object with success
		 */
		exports.update1 = function(req, res) {
		    var errorMessage = "";
		    var outputJSON = "";
		    var streamingad = req.body;
		    streamingad.save(function(err, data) {
		        if (err) {
		            switch (err.name) {
		                case 'ValidationError':
		                    for (field in err.errors) {
		                        if (errorMessage == "") {
		                            errorMessage = err.errors[field].message;
		                        } else {
		                            errorMessage += "\r\n" + err.errors[field].message;
		                        }
		                    } //for
		                    break;
		            } //switch
		            outputJSON = { 'status': 'failure', 'messageId': 401, 'message': errorMessage };
		        } //if
		        else {
		            outputJSON = { 'status': 'success', 'messageId': 200, 'message': constantObj.messages.streamingadStatusUpdateSuccess };
		        }
		        res.jsonp(outputJSON);
		    });



		}
		exports.update = function(req, res) {
		    var errorMessage = "";
		    var outputJSON = "";
		    var streamingad = req.streamingad;
		    streamingad.AdTitle = req.body.AdTitle;
		    streamingad.adType = req.body.adType;
		    streamingad.AudioPricing = req.body.AudioPricing;
		    streamingad.BannerPricing = req.body.BannerPricing;
		    streamingad.TargetImpressions = req.body.TargetImpressions;
		    streamingad.Description = req.body.Description;
		    streamingad.Advertiser = req.body.Advertiser;
		    streamingad.PricingModel = req.body.PricingModel;
		    streamingad.Expires = req.body.Expires;
		    streamingad.Frequency=req.body.Frequency;
		    streamingad.Category = req.body.Category;
		    streamingad.minAge = req.body.minAge;
		    streamingad.maxAge = req.body.maxAge;
		    streamingad.minARPU = req.body.minARPU;
		    streamingad.maxARPU = req.body.maxARPU;
		    streamingad.minPhoneValue = req.body.minPhoneValue;
		    streamingad.maxPhoneValue = req.body.maxPhoneValue;
		    streamingad.Gender = req.body.Gender;

		    streamingad.Billing = req.body.Billing;
		    streamingad.offset = req.body.offset;
		    streamingad.Duration = req.body.Duration;
		    streamingad.Genre = req.body.Genre;
		    streamingad.platformType = req.body.platformType;
		    streamingad.language = req.body.language;
		    streamingad.ConnectionType = req.body.ConnectionType;
		    streamingad.phoneValue = req.body.phoneValue;
		    streamingad.phoneType = req.body.phoneType;
		    streamingad.ARPU = req.body.ARPU;
		    streamingad.City = req.body.City;
		    streamingad.State = req.body.State;
		    streamingad.Age = req.body.Age;
		    streamingad.Companion = req.body.Companion;
		    streamingad.Linear = req.body.Linear;
		    streamingad.endDate = req.body.endDate;
		    streamingad.startDate = req.body.startDate;
		    streamingad.impressionTracker=req.body.impressionTracker;
		    //language trackers
		    streamingad.HindiTracker=req.body.HindiTracker;
		    streamingad.EnglishTracker=req.body.EnglishTracker;
		    streamingad.PanjabiTracker=req.body.PanjabiTracker;
		    streamingad.BengaliTracker=req.body.BengaliTracker;
		    streamingad.MarathiTracker=req.body.MarathiTracker;
		    streamingad.TeluguTracker=req.body.TeluguTracker;
		    streamingad.TamilTracker=req.body.TamilTracker;
		    streamingad.GujaratiTracker=req.body.GujaratiTracker;
		    streamingad.KannadaTracker=req.body.KannadaTracker;
		    streamingad.OdiaTracker=req.body.OdiaTracker;
		    streamingad.MalayalamTracker=req.body.MalayalamTracker;
		    streamingad.BhojpuriTracker=req.body.BhojpuriTracker;
		    streamingad.AssameseTracker=req.body.AssameseTracker;
		    streamingad.RajasthaniTracker=req.body.RajasthaniTracker;
		    streamingad.UrduTracker=req.body.UrduTracker;
		    streamingad.HindiBTracker=req.body.HindiBTracker;
		    streamingad.EnglishBTracker=req.body.EnglishBTracker;
		    streamingad.PanjabiBTracker=req.body.PanjabiBTracker;
		    streamingad.BengaliBTracker=req.body.BengaliBTracker;
		    streamingad.MarathiBTracker=req.body.MarathiBTracker;
		    streamingad.TeluguBTracker=req.body.TeluguBTracker;
		    streamingad.TamilBTracker=req.body.TamilBTracker;
		    streamingad.GujaratiBTracker=req.body.GujaratiBTracker;
		    streamingad.KannadaBTracker=req.body.KannadaBTracker;
		    streamingad.OdiaBTracker=req.body.OdiaBTracker;
		    streamingad.MalayalamBTracker=req.body.MalayalamBTracker;
		    streamingad.BhojpuriBTracker=req.body.BhojpuriBTracker;
		    streamingad.AssameseBTracker=req.body.AssameseBTracker;
		    streamingad.RajasthaniBTracker=req.body.RajasthaniBTracker;
		    streamingad.UrduBTracker=req.body.UrduBTracker;

		    //
		    streamingad.enable = true;
		    streamingad.isPaid = req.body.isPaid;
		    streamingad.jioPaid = req.body.jioPaid;
		    streamingad.gaanaPaid = req.body.gaanaPaid;
		    streamingad.wynkPaid = req.body.wynkPaid;
		    streamingad.hungamaPaid = req.body.hungamaPaid;
		    streamingad.spotifyPaid = req.body.spotifyPaid;
if (req.body.filedata != undefined && req.body.filedata != '') {
		        reqdata = {};
		        reqdata._id = req.body._id;
		        reqdata.file = req.body.filedata;
		        reqdata.filetype = req.body.filetype;
		        uploadRO(reqdata, function(responce) {
		        	streamingad.attchedRO=responce.file;
		    streamingad.save(function(err, data) {
		        if (err) {
		            switch (err.name) {
		                case 'ValidationError':
		                    for (field in err.errors) {
		                        if (errorMessage == "") {
		                            errorMessage = err.errors[field].message;
		                        } else {
		                            errorMessage += "\r\n" + err.errors[field].message;
		                        }
		                    } //for
		                    break;
		            } //switch
		            outputJSON = { 'status': 'failure', 'messageId': 401, 'message': errorMessage };
		        } //if
		        else {
		            outputJSON = { 'status': 'success', 'messageId': 200, 'message': constantObj.messages.streamingadStatusUpdateSuccess };
		        }
		        res.jsonp(outputJSON);
		    });
		         });
		    } else { 	
streamingad.save(function(err, data) {
		        //console.log(err);
		        //console.log(data);
		        if (err) {
		            switch (err.name) {
		                case 'ValidationError':
		                    for (field in err.errors) {
		                        if (errorMessage == "") {
		                            errorMessage = err.errors[field].message;
		                        } else {
		                            errorMessage += "\r\n" + err.errors[field].message;
		                        }
		                    } //for
		                    break;
		            } //switch
		            outputJSON = { 'status': 'failure', 'messageId': 401, 'message': errorMessage };
		        } //if
		        else {
		            outputJSON = { 'status': 'success', 'messageId': 200, 'message': constantObj.messages.streamingadStatusUpdateSuccess };
		        }
		        res.jsonp(outputJSON);
		    });
		 }

		}

		function formatDate(datev) {
		    var date = new Date(datev);
		    var year = date.getFullYear();
		    var month = date.getMonth() + 1;
		    month = (month < 10 ? "0" : "") + month;
		    var day = date.getDate();
		    day = (day < 10 ? "0" : "") + day;
		    var datvar = year + "-" + month + "-" + day;
		    return datvar;
		}
		exports.campaignReporting = function(req, res) {
		    //console.log('In Reporting');
		    var outputJSON = "";
		    var totalRows = 0;
		    var campaigns = [];
		    var searchquery = {};
		    streamingadObj.find({}, function(err, campaigns) {
		        if (err) {
		            console.log('Error', err);
		        } else {
		            campaignwisereportObj.aggregate([{ $match: searchquery },
		                    { $project: { campaignId: "$campaignId", requests: "$requests", ads: "$ads", servedAudioImpressions: "$servedAudioImpressions", servedCompanionAds: "$servedCompanionAds", completedAudioImpressions: "$completedAudioImpressions", CompanioncreativeView: "$CompanioncreativeView", CompanionClickTracking: "$CompanionClickTracking" } }, {
		                        $group: {
		                            _id: "$campaignId",
		                            "requests": {
		                                $sum: "$requests"
		                            },
		                            "ads": {
		                                $sum: "$ads"
		                            },
		                            "servedAudioImpressions": {
		                                $sum: "$servedAudioImpressions"
		                            },
		                            "servedCompanionAds": {
		                                $sum: "$servedCompanionAds"
		                            },
		                            "completedAudioImpressions": {
		                                $sum: "$completedAudioImpressions"
		                            },
		                            "CompanioncreativeView": {
		                                $sum: "$CompanioncreativeView"
		                            },
		                            "CompanionClickTracking": {
		                                $sum: "$CompanionClickTracking"
		                            },
		                        }
		                    }
		                ]
		            ).exec(function(err, datatotalOld) {
		                if (err) {
		                    console.log('Err', err);
		                } else {
		                    outputJSON = {
		                        'status': 'success',
		                        'messageId': 200,
		                        'message': constantObj.messages.successRetreivingData,
		                        'campaignDetails': campaigns,
		                        'data': datatotalOld
		                    }
		                    res.jsonp(outputJSON);
		                }
		            });
		        }
		    });
		}
		exports.listadrequest = function(req, res) {
		    var outputJSON = "";
		    var toralRows = 0;
		    var url_parts = url.parse(req.url, true);
		    var query = url_parts.query;
		    var page = query.page;
		    var count = parseInt(query.count);
		    var skip = parseInt(parseInt(page - 1) * parseInt(count));
		    adrequestObj.find({}).count().exec(function(err1, countd) {
		        if (err1) {
		            console.log('Err', err1);
		        } else {
		            toralRows = countd;
		            adrequestObj.find({}, {}, { sort: { _id: -1 }, skip: skip, limit: count }, function(err, data) {
		                if (err) {
		                    console.log('Err', err);
		                } else {
		                    outputJSON = {
		                        'status': 'success',
		                        'messageId': 200,
		                        'message': constantObj.messages.successRetreivingData,
		                        'data': data,
		                        'totalRows': toralRows
		                    }
		                    res.jsonp(outputJSON);
		                }
		            });
		        }
		    });
		}
		exports.bulkUpdate = function(req, res) {
		    var outputJSON = "";
		    var inputData = req.body;
		    var circleLength = inputData.data.length;
		    var bulk = streamingadObj.collection.initializeUnorderedBulkOp();
		    for (var i = 0; i < circleLength; i++) {
		        var circleData = inputData.data[i];
		        var id = mongoose.Types.ObjectId(circleData.id);
		        bulk.find({ _id: id }).update({ $set: circleData });
		    }
		    bulk.execute(function(data) {
		        outputJSON = { 'status': 'success', 'messageId': 200, 'message': constantObj.messages.streamingadStatusUpdateSuccess };
		    });
		    res.jsonp(outputJSON);
		}
		function paidCampaigns(appId,callback) {
		    var paidCamps = [];
		     var conditions={};
		     conditions.isPaid=true;
		     if(appId!=''){
               if(appId=='5a1e46beeb993dc67979412e'){
              	conditions.jioPaid=true;
               } else if(appId=='5adeeb79cf7a7e3e5d822106'){
              	conditions.gaanaPaid=true;
                } else if(appId=='5b2210af504f3097e73e0d8b'){
              	conditions.wynkPaid=true;
                }else{}
             }
		    streamingadObj.find(conditions, ['_id'], function(err, dataCamp) {
		        if (err) {
		            callback(paidCamps);
		        } else {
		            var lengthofdataCamp = dataCamp.length;
		            if (lengthofdataCamp > 0) {
		                for (var j = 0; j < lengthofdataCamp; j++) {
		                    paidCamps.push(dataCamp[j]._id);
		                }
		            }
		            callback(paidCamps);
		        }
		    });
		}
		exports.jioreporting = function(req, res) {
		    var outputJSON = "";
		    var campaignReports = [];
		    var isPaid = true;
		    var totalRows = 0;
		    var url_parts = url.parse(req.url, true);
		    var query = url_parts.query;
		    var startDate = query.startdate;
		    var endDate = query.enddate;
		    var appId = query.appId;
		    var searchquery = {};
		    var searchquerynew = {};
		    if (startDate != '' && endDate != '') {
		        startDate = formatDate(startDate);
		        endDate = formatDate(endDate);
		        var dateq = { $gte: startDate, $lte: endDate };
		        searchquery.date = dateq;
		        searchquerynew.date = dateq;
		    } else if (startDate != '') {
		        startDate = formatDate(startDate);
		        var dateq = { $gte: startDate };
		        searchquery.date = dateq;
		        searchquerynew.date = dateq;
		    } else if (endDate != '') {
		        endDate = formatDate(endDate);
		        var dateq = { $lte: endDate };
		        searchquery.date = dateq;
		        searchquerynew.date = dateq;
		    } else {
		        var dateq = '';
		    }
		    if (appId != '') {
		        searchquery.appId = appId;
		        searchquerynew.appId = appId;
		    }
		    paidCampaigns(appId, function(paidids) {
		        streamingadObj.find({ _id: { $in: paidids } }, { AdTitle: 1, AudioPricing: 1, BannerPricing: 1, Pricing: 1, TargetImpressions: 1, Advertiser: 1, PricingModel: 1, Category: 1, Duration: 1, createdOn: 1, _id: 1, startDate: 1, endDate: 1, attchedRO:1}, { sort: { startDate: -1 } }, function(err, campaignDetails) {
		            if (err) {
		                console.log('Error', err);
		            } else {
		                var pidinq = { $in: paidids };
		                searchquery.campaignId = pidinq;
                        var request = require('request');
		     var reqdata={};
		     reqdata.ids=paidids;
		     reqdata.appId=appId;
		     reqdata.startdate=startDate;
		      reqdata.enddate=endDate;
		request.post({
               url: 'http://13.232.2.111:3000/streamingads/jioreporting',
               body: reqdata,
               json: true
               }, function(error, response, resbody){
               	 if(error){console.log(error);}
               	 else{
               	 if(response.statusCode == 200) {
                    outputJSON = {
		                                    'status': 'success',
		                                    'messageId': 200,
		                                    'message': constantObj.messages.successRetreivingData,
		                                    'campaignDetails': campaignDetails,
		                                    'datatotalOld': resbody.datatotalOld,
		                                    'campaignIds': paidids,
		                                    'countdata': resbody.countdata
		                                }
		                                res.jsonp(outputJSON);  
                    }else{
                    	outputJSON = {
		                                    'status': 'success',
		                                    'messageId': 200,
		                                    'message': 'failed',
		                                    'campaignDetails': [],
		                                    'datatotalOld': [],
		                                    'campaignIds': [],
		                                    'countdata': 0
		                                }
		                                res.jsonp(outputJSON);
                    }
                   }
                 });
		            }
		        });
		    });
		}
				exports.getcampaignreport = function(req, res) {
		    //console.log('In reporting...');
		    var outputJSON = "";
		    var campaignReports = [];
		    var isPaid = true;
		    var totalRows = 0;
		    var url_parts = url.parse(req.url, true);
		    var query = url_parts.query;
		    //var page = query.page;
		    //var count = parseInt(query.count);
		   
		    var startDate = '';//query.startdate;
		    var endDate =''; //query.enddate;
		    var appId =''; //query.appId;
		    var campaignId=query.campaignId
            //  var skip = parseInt(parseInt(page - 1) * parseInt(count));
		    //console.log('page', page);
		    //console.log('count', count);
		    //console.log('qstring', qstring);
		    var searchquery = {};
		    var searchquerynew = {};
		    if (startDate != '' && endDate != '') {
		        startDate = formatDate(startDate);
		        endDate = formatDate(endDate);
		        var dateq = { $gte: startDate, $lte: endDate };
		        searchquery.date = dateq;
		        searchquerynew.date = dateq;
		    } else if (startDate != '') {
		        startDate = formatDate(startDate);
		        var dateq = { $gte: startDate };
		        searchquery.date = dateq;
		        searchquerynew.date = dateq;
		    } else if (endDate != '') {
		        endDate = formatDate(endDate);
		        var dateq = { $lte: endDate };
		        searchquery.date = dateq;
		        searchquerynew.date = dateq;
		    } else {
		        var dateq = '';

		    }
		    if (appId != '') {
		        searchquery.appId = appId;
		        searchquerynew.appId = appId;
		    }
		    // Get  Campaign
		        //  console.log('paidids', paidids);
		        streamingadObj.find({ _id: campaignId }, { AdTitle: 1, AudioPricing: 1, BannerPricing: 1, Pricing: 1, TargetImpressions: 1, Advertiser: 1, PricingModel: 1, Category: 1, Duration: 1, createdOn: 1, _id: 1, startDate: 1, endDate: 1, attchedRO:1}, { sort: { startDate: -1 } }, function(err, campaignDetails) {
		            if (err) {
		                console.log('Error', err);
		            } else {
		                //console.log('CampaignDetails', campaignDetails);

		               
            /***** start of thirdparty call**/
                       
		       //console.log('reqdata',reqdata); //Error: Arguments must be aggregate pipeline operators
		       var searchquery2={};

		        searchquery2.campaignId =mongoose.Types.ObjectId(campaignId); //;
		        //var cmpid=mongoose.Types.ObjectId(campaignId); { "campaignId": mongoose.Types.ObjectId("6012f86e4024af291f2a94bf") }
       campaignwisereportObj.aggregate([
       { "$match": searchquery2 },
       { $project: { campaignId: "$campaignId", complete: "$complete", impression: "$impression", requests: "$requests", ads: "$ads", servedAudioImpressions: "$servedAudioImpressions", servedCompanionAds: "$servedCompanionAds", completedAudioImpressions: "$completedAudioImpressions", CompanioncreativeView: "$CompanioncreativeView", CompanionClickTracking: "$CompanionClickTracking",SovClickTracking:"$SovClickTracking" } }, 
       {
										$group: {
		                                        _id: "",
		                                        "requests": {
		                                            $sum: "$requests"
		                                        },
		                                        "ads": {
		                                            $sum: "$ads"
		                                        },
		                                        "impression":{
													$sum: "$impression"
		                                        },
		                                        "impression":{
													$sum: "$impression"
		                                        },
		                                        "complete":{
													$sum: "$complete"
		                                        },
		                                        "completedAudioImpressions": {
		                                            $sum: "$completedAudioImpressions"
		                                        },
		                                        "CompanionClickTracking": {
		                                            $sum: "$CompanionClickTracking"
		                                        }
		                                    }
		                                },
    ]).exec(function(err, datatotalOld) {
		                            if (err) {
		                                console.log('Err', err);
		                            } else {
                                outputJSON = {
		                                    'status': 'success',
		                                    'messageId': 200,
		                                    'message': constantObj.messages.successRetreivingData,
		                                    'reportingData': datatotalOld,
		                                    'campaignDetails': campaignDetails,
		                                    'campaignId': campaignId
		                                }
		                                res.jsonp(outputJSON);
		                            }
		                        });
		      /* old code
		       var request = require('request');
		    // call PT(Music Ads DBS) tracking
		     var reqdata={};
		       reqdata.campaignId=campaignId;
		       reqdata.startdate=startDate;
		       reqdata.enddate=endDate;
		       request.post({
               url: 'http://13.232.2.111:3000/streamingads/getcampaignreport',
               body: reqdata,
               json: true
               }, function(error, response, resbody){
               	 if(error){console.log(error);}
               	 else{
               	 if(response.statusCode == 200) {
               	    outputJSON = {
		                                    'status': 'success',
		                                    'messageId': 200,
		                                    'message': constantObj.messages.successRetreivingData,
		                                    'campaignDetails': campaignDetails,
		                                    'reportingData': resbody.datatotalOld,
		                                    'campaignIds': campaignId
		                                }
		                                res.jsonp(outputJSON);  
                    }else{
                    	outputJSON = {
		                                    'status': 'success',
		                                    'messageId': 200,
		                                    'message': 'failed',
		                                    'campaignDetails': [],
		                                    'reportingData': [],
		                                    'campaignIds': campaignId,
		                                    'countdata': 0
		                                }
		                                res.jsonp(outputJSON);
                    }
                   }
                 });
		       */ 
              
		            }
		        });
		    


		}
		
		exports.gettpreportnew = function(req, res) {
		    //console.log('In reporting...');
		    var outputJSON = "";
		    var campaignReports = [];
		    var isPaid = true;
		    var totalRows = 0;
		    var url_parts = url.parse(req.url, true);
		    var query = url_parts.query;
		    //var page = query.page;
		    //var count = parseInt(query.count);
		   
		    var startDate = '';//query.startdate;
		    var endDate =''; //query.enddate;
		    var appId =''; //query.appId;
		    var campaignId=query.campaignId
            //  var skip = parseInt(parseInt(page - 1) * parseInt(count));
		    //console.log('page', page);
		    //console.log('count', count);
		    //console.log('qstring', qstring);
		    var searchquery = {};
		    var searchquerynew = {};
		    if (startDate != '' && endDate != '') {
		        startDate = formatDate(startDate);
		        endDate = formatDate(endDate);
		        var dateq = { $gte: startDate, $lte: endDate };
		        searchquery.date = dateq;
		        searchquerynew.date = dateq;
		    } else if (startDate != '') {
		        startDate = formatDate(startDate);
		        var dateq = { $gte: startDate };
		        searchquery.date = dateq;
		        searchquerynew.date = dateq;
		    } else if (endDate != '') {
		        endDate = formatDate(endDate);
		        var dateq = { $lte: endDate };
		        searchquery.date = dateq;
		        searchquerynew.date = dateq;
		    } else {
		        var dateq = '';

		    }
		    if (appId != '') {
		        searchquery.appId = appId;
		        searchquerynew.appId = appId;
		    }
		    // Get  Campaign
		        //  console.log('paidids', paidids);
		        streamingadObj.find({ _id: campaignId }, { AdTitle: 1, AudioPricing: 1, BannerPricing: 1, Pricing: 1, TargetImpressions: 1, Advertiser: 1, PricingModel: 1, Category: 1, Duration: 1, createdOn: 1, _id: 1, startDate: 1, endDate: 1, attchedRO:1}, { sort: { startDate: -1 } }, function(err, campaignDetails) {
		            if (err) {
		                console.log('Error', err);
		            } else {
		                //console.log('CampaignDetails', campaignDetails);

		                searchquery.campaignId = campaignId;
            /***** start of thirdparty call**/
                        var request = require('request');
		    // call PT(Music Ads DBS) tracking
		     var reqdata={};
		       reqdata.campaignId=campaignId;
		       reqdata.startdate=startDate;
		       reqdata.enddate=endDate;
		       //console.log('reqdata',reqdata);
		       request.post({
               url: 'http://13.232.2.111:3000/streamingads/gettpreportnew',
               body: reqdata,
               json: true
               }, function(error, response, resbody){
               	 if(error){console.log(error);}
               	 else{
               	 if(response.statusCode == 200) {
               	 	//console.log('resbody',resbody);
                    outputJSON = {
		                                    'status': 'success',
		                                    'messageId': 200,
		                                    'message': constantObj.messages.successRetreivingData,
		                                    'campaignDetails': campaignDetails,
		                                    'reportingData': resbody.data,
		                                    'campaignIds': campaignId
		                                }
		                                res.jsonp(outputJSON);  
                    }else{
                    	outputJSON = {
		                                    'status': 'success',
		                                    'messageId': 200,
		                                    'message': 'failed',
		                                    'campaignDetails': [],
		                                    'reportingData': [],
		                                    'campaignIds': campaignId,
		                                    'countdata': 0
		                                }
		                                res.jsonp(outputJSON);
                    }
                   }
                 });
              
		            }
		        });
		    


		}
		exports.getmakereport = function(req, res) {
			var outputJSON = "";
		    var campaignReports = [];
		     var url_parts = url.parse(req.url, true);
		     var query = url_parts.query;
		     var startDate = '';
		    var endDate =''; 
		    var appId =''; 
		    var campaignId=query.campaignId
		    var searchquery = {};
		    if (startDate != '' && endDate != '') {
		        startDate = formatDate(startDate);
		        endDate = formatDate(endDate);
		        var dateq = { $gte: startDate, $lte: endDate };
		        searchquery.date = dateq;
		    } else if (startDate != '') {
		        startDate = formatDate(startDate);
		        var dateq = { $gte: startDate };
		        searchquery.date = dateq;
		    } else if (endDate != '') {
		        endDate = formatDate(endDate);
		        var dateq = { $lte: endDate };
		        searchquery.date = dateq;
		    } else {
		        var dateq = '';

		    }
		    if (appId != '') {
		        searchquery.appId = appId;
		    }
		    streamingadObj.find({ _id: campaignId }, { AdTitle: 1, AudioPricing: 1, BannerPricing: 1, Pricing: 1, TargetImpressions: 1, Advertiser: 1, PricingModel: 1, Category: 1, Duration: 1, createdOn: 1, _id: 1, startDate: 1, endDate: 1, attchedRO:1}, { sort: { startDate: -1 } }, function(err, campaignDetails) {
		            if (err) {
		                console.log('Error', err);
		            } else {
		            	//
		var searchquery2 = {};  
		searchquery2.campaignId=mongoose.Types.ObjectId(campaignId);       
      phonemakereportObj.aggregate([
       { "$match": searchquery2 },
       { $project: { campaignId: "$campaignId", complete: "$complete", impression: "$impression", phoneMake: "$phoneMake", appId: "$appId", CompanionClickTracking: "$CompanionClickTracking" } }, 
       {
										$group: {
		                                        _id: "$phoneMake",
		                                        "impression":{
													$sum: "$impression"
		                                        },
		                                        "complete":{
													$sum: "$complete"
		                                        },
		                                        "CompanionClickTracking": {
		                                            $sum: "$CompanionClickTracking"
		                                        }
		                                    }
		                                },
    ]).exec(function(err, datatotalOld) {
		                            if (err) {
		                                console.log('Err', err);
		                            } else {
                                outputJSON = {
		                                    'status': 'success',
		                                    'messageId': 200,
		                                    'message': constantObj.messages.successRetreivingData,
		                                    'reportingData': datatotalOld,
		                                    'campaignDetails': campaignDetails,
		                                    'campaignId': campaignId
		                                }
		                                res.jsonp(outputJSON);
		                            }
		                        });
		            }
		        });

		}
		exports.getmodelreport = function(req, res) {
			var outputJSON = "";
		    var campaignReports = [];
		     var url_parts = url.parse(req.url, true);
		     var query = url_parts.query;
		     var startDate = '';
		    var endDate =''; 
		    var appId =''; 
		    var campaignId=query.campaignId
		    var searchquery = {};
		    if (startDate != '' && endDate != '') {
		        startDate = formatDate(startDate);
		        endDate = formatDate(endDate);
		        var dateq = { $gte: startDate, $lte: endDate };
		        searchquery.date = dateq;
		    } else if (startDate != '') {
		        startDate = formatDate(startDate);
		        var dateq = { $gte: startDate };
		        searchquery.date = dateq;
		    } else if (endDate != '') {
		        endDate = formatDate(endDate);
		        var dateq = { $lte: endDate };
		        searchquery.date = dateq;
		    } else {
		        var dateq = '';

		    }
		    if (appId != '') {
		        searchquery.appId = appId;
		    }
		    streamingadObj.find({ _id: campaignId }, { AdTitle: 1, AudioPricing: 1, BannerPricing: 1, Pricing: 1, TargetImpressions: 1, Advertiser: 1, PricingModel: 1, Category: 1, Duration: 1, createdOn: 1, _id: 1, startDate: 1, endDate: 1, attchedRO:1}, { sort: { startDate: -1 } }, function(err, campaignDetails) {
		            if (err) {
		                console.log('Error', err);
		            } else {
		            	//
		var searchquery2 = {};  
		searchquery2.campaignId=mongoose.Types.ObjectId(campaignId);       
      phonemodelreportObj.aggregate([
       { "$match": searchquery2 },
       { $project: { campaignId: "$campaignId", complete: "$complete", impression: "$impression", phoneModel: "$phoneModel", appId: "$appId", CompanionClickTracking: "$CompanionClickTracking" } }, 
       {
										$group: {
		                                        _id: "$phoneModel",
		                                        "impression":{
													$sum: "$impression"
		                                        },
		                                        "complete":{
													$sum: "$complete"
		                                        },
		                                        "CompanionClickTracking": {
		                                            $sum: "$CompanionClickTracking"
		                                        }
		                                    }
		                                },
    ]).exec(function(err, datatotalOld) {
		                            if (err) {
		                                console.log('Err', err);
		                            } else {
                                outputJSON = {
		                                    'status': 'success',
		                                    'messageId': 200,
		                                    'message': constantObj.messages.successRetreivingData,
		                                    'reportingData': datatotalOld,
		                                    'campaignDetails': campaignDetails,
		                                    'campaignId': campaignId
		                                }
		                                res.jsonp(outputJSON);
		                            }
		                        });
		            }
		        });

		}

		exports.getplatformreport = function(req, res) {
			var outputJSON = "";
		    var campaignReports = [];
		     var url_parts = url.parse(req.url, true);
		     var query = url_parts.query;
		     var startDate = '';
		    var endDate =''; 
		    var appId =''; 
		    var campaignId=query.campaignId
		    var searchquery = {};
		    if (startDate != '' && endDate != '') {
		        startDate = formatDate(startDate);
		        endDate = formatDate(endDate);
		        var dateq = { $gte: startDate, $lte: endDate };
		        searchquery.date = dateq;
		    } else if (startDate != '') {
		        startDate = formatDate(startDate);
		        var dateq = { $gte: startDate };
		        searchquery.date = dateq;
		    } else if (endDate != '') {
		        endDate = formatDate(endDate);
		        var dateq = { $lte: endDate };
		        searchquery.date = dateq;
		    } else {
		        var dateq = '';

		    }
		    if (appId != '') {
		        searchquery.appId = appId;
		    }
		    streamingadObj.find({ _id: campaignId }, { AdTitle: 1, AudioPricing: 1, BannerPricing: 1, Pricing: 1, TargetImpressions: 1, Advertiser: 1, PricingModel: 1, Category: 1, Duration: 1, createdOn: 1, _id: 1, startDate: 1, endDate: 1, attchedRO:1}, { sort: { startDate: -1 } }, function(err, campaignDetails) {
		            if (err) {
		                console.log('Error', err);
		            } else {
		            	//
		var searchquery2 = {};  
		searchquery2.campaignId=mongoose.Types.ObjectId(campaignId);       
      platformtypereportObj.aggregate([
       { "$match": searchquery2 },
       { $project: { campaignId: "$campaignId", complete: "$complete", impression: "$impression", platformType: "$platformType", appId: "$appId", CompanionClickTracking: "$CompanionClickTracking" } }, 
       {
										$group: {
		                                        _id: "$platformType",
		                                        "impression":{
													$sum: "$impression"
		                                        },
		                                        "complete":{
													$sum: "$complete"
		                                        },
		                                        "CompanionClickTracking": {
		                                            $sum: "$CompanionClickTracking"
		                                        }
		                                    }
		                                },
    ]).exec(function(err, datatotalOld) {
		                            if (err) {
		                                console.log('Err', err);
		                            } else {
                                outputJSON = {
		                                    'status': 'success',
		                                    'messageId': 200,
		                                    'message': constantObj.messages.successRetreivingData,
		                                    'reportingData': datatotalOld,
		                                    'campaignDetails': campaignDetails,
		                                    'campaignId': campaignId
		                                }
		                                res.jsonp(outputJSON);
		                            }
		                        });
		            }
		        });

		}

		exports.getpptypereport = function(req, res) {
			var outputJSON = "";
		    var campaignReports = [];
		     var url_parts = url.parse(req.url, true);
		     var query = url_parts.query;
		     var startDate = '';
		    var endDate =''; 
		    var appId =''; 
		    var campaignId=query.campaignId
		    var searchquery = {};
		    if (startDate != '' && endDate != '') {
		        startDate = formatDate(startDate);
		        endDate = formatDate(endDate);
		        var dateq = { $gte: startDate, $lte: endDate };
		        searchquery.date = dateq;
		    } else if (startDate != '') {
		        startDate = formatDate(startDate);
		        var dateq = { $gte: startDate };
		        searchquery.date = dateq;
		    } else if (endDate != '') {
		        endDate = formatDate(endDate);
		        var dateq = { $lte: endDate };
		        searchquery.date = dateq;
		    } else {
		        var dateq = '';

		    }
		    if (appId != '') {
		        searchquery.appId = appId;
		    }
		    streamingadObj.find({ _id: campaignId }, { AdTitle: 1, AudioPricing: 1, BannerPricing: 1, Pricing: 1, TargetImpressions: 1, Advertiser: 1, PricingModel: 1, Category: 1, Duration: 1, createdOn: 1, _id: 1, startDate: 1, endDate: 1, attchedRO:1}, { sort: { startDate: -1 } }, function(err, campaignDetails) {
		            if (err) {
		                console.log('Error', err);
		            } else {
		            	//
		var searchquery2 = {};  
		searchquery2.campaignId=mongoose.Types.ObjectId(campaignId);       
      pptypereportObj.aggregate([
       { "$match": searchquery2 },
       { $project: { campaignId: "$campaignId", complete: "$complete", impression: "$impression", pptype: "$pptype", appId: "$appId", CompanionClickTracking: "$CompanionClickTracking" } }, 
       {
										$group: {
		                                        _id: "$pptype",
		                                        "impression":{
													$sum: "$impression"
		                                        },
		                                        "complete":{
													$sum: "$complete"
		                                        },
		                                        "CompanionClickTracking": {
		                                            $sum: "$CompanionClickTracking"
		                                        }
		                                    }
		                                },
    ]).exec(function(err, datatotalOld) {
		                            if (err) {
		                                console.log('Err', err);
		                            } else {
                                outputJSON = {
		                                    'status': 'success',
		                                    'messageId': 200,
		                                    'message': constantObj.messages.successRetreivingData,
		                                    'reportingData': datatotalOld,
		                                    'campaignDetails': campaignDetails,
		                                    'campaignId': campaignId
		                                }
		                                res.jsonp(outputJSON);
		                            }
		                        });
		            }
		        });

		}
		exports.getregionreport = function(req, res) {
			var outputJSON = "";
		    var campaignReports = [];
		     var url_parts = url.parse(req.url, true);
		     var query = url_parts.query;
		     var startDate = '';
		    var endDate =''; 
		    var appId =''; 
		    var campaignId=query.campaignId
		    var searchquery = {};
		    if (startDate != '' && endDate != '') {
		        startDate = formatDate(startDate);
		        endDate = formatDate(endDate);
		        var dateq = { $gte: startDate, $lte: endDate };
		        searchquery.date = dateq;
		    } else if (startDate != '') {
		        startDate = formatDate(startDate);
		        var dateq = { $gte: startDate };
		        searchquery.date = dateq;
		    } else if (endDate != '') {
		        endDate = formatDate(endDate);
		        var dateq = { $lte: endDate };
		        searchquery.date = dateq;
		    } else {
		        var dateq = '';

		    }
		    if (appId != '') {
		        searchquery.appId = appId;
		    }
		    streamingadObj.find({ _id: campaignId }, { AdTitle: 1, AudioPricing: 1, BannerPricing: 1, Pricing: 1, TargetImpressions: 1, Advertiser: 1, PricingModel: 1, Category: 1, Duration: 1, createdOn: 1, _id: 1, startDate: 1, endDate: 1, attchedRO:1}, { sort: { startDate: -1 } }, function(err, campaignDetails) {
		            if (err) {
		                console.log('Error', err);
		            } else {
		            	//
		var searchquery2 = {};  
		searchquery2.campaignId=mongoose.Types.ObjectId(campaignId);       
      regionreportObj.aggregate([
       { "$match": searchquery2 },
       { $project: { campaignId: "$campaignId", complete: "$complete", impression: "$impression", region: "$region", appId: "$appId", CompanionClickTracking: "$CompanionClickTracking" } }, 
       {
										$group: {
		                                        _id: "$region",
		                                        "impression":{
													$sum: "$impression"
		                                        },
		                                        "complete":{
													$sum: "$complete"
		                                        },
		                                        "CompanionClickTracking": {
		                                            $sum: "$CompanionClickTracking"
		                                        }
		                                    }
		                                },
    ]).exec(function(err, datatotalOld) {
		                            if (err) {
		                                console.log('Err', err);
		                            } else {
                                outputJSON = {
		                                    'status': 'success',
		                                    'messageId': 200,
		                                    'message': constantObj.messages.successRetreivingData,
		                                    'reportingData': datatotalOld,
		                                    'campaignDetails': campaignDetails,
		                                    'campaignId': campaignId
		                                }
		                                res.jsonp(outputJSON);
		                            }
		                        });
		            }
		        });

		}

		exports.getzipreport = function(req, res) {
			var outputJSON = "";
		    var campaignReports = [];
		     var url_parts = url.parse(req.url, true);
		     var query = url_parts.query;
		     var startDate = '';
		    var endDate =''; 
		    var appId =''; 
		    var campaignId=query.campaignId
		    var searchquery = {};
		    if (startDate != '' && endDate != '') {
		        startDate = formatDate(startDate);
		        endDate = formatDate(endDate);
		        var dateq = { $gte: startDate, $lte: endDate };
		        searchquery.date = dateq;
		    } else if (startDate != '') {
		        startDate = formatDate(startDate);
		        var dateq = { $gte: startDate };
		        searchquery.date = dateq;
		    } else if (endDate != '') {
		        endDate = formatDate(endDate);
		        var dateq = { $lte: endDate };
		        searchquery.date = dateq;
		    } else {
		        var dateq = '';

		    }
		    if (appId != '') {
		        searchquery.appId = appId;
		    }
		    streamingadObj.find({ _id: campaignId }, { AdTitle: 1, AudioPricing: 1, BannerPricing: 1, Pricing: 1, TargetImpressions: 1, Advertiser: 1, PricingModel: 1, Category: 1, Duration: 1, createdOn: 1, _id: 1, startDate: 1, endDate: 1, attchedRO:1}, { sort: { startDate: -1 } }, function(err, campaignDetails) {
		            if (err) {
		                console.log('Error', err);
		            } else {
		            	//
		var searchquery2 = {};  
		searchquery2.campaignId=mongoose.Types.ObjectId(campaignId);       
      zipreportObj.aggregate([
       { "$match": searchquery2 },
       { $project: { campaignId: "$campaignId", complete: "$complete", impression: "$impression", zip: "$zip", appId: "$appId", CompanionClickTracking: "$CompanionClickTracking" } }, 
       {
										$group: {
		                                        _id: "$zip",
		                                        "impression":{
													$sum: "$impression"
		                                        },
		                                        "complete":{
													$sum: "$complete"
		                                        },
		                                        "CompanionClickTracking": {
		                                            $sum: "$CompanionClickTracking"
		                                        }
		                                    }
		                                },
    ]).exec(function(err, datatotalOld) {
		                            if (err) {
		                                console.log('Err', err);
		                            } else {
                                outputJSON = {
		                                    'status': 'success',
		                                    'messageId': 200,
		                                    'message': constantObj.messages.successRetreivingData,
		                                    'reportingData': datatotalOld,
		                                    'campaignDetails': campaignDetails,
		                                    'campaignId': campaignId
		                                }
		                                res.jsonp(outputJSON);
		                            }
		                        });
		            }
		        });

		}

		exports.getbundlereport = function(req, res) {
			var outputJSON = "";
		    var campaignReports = [];
		     var url_parts = url.parse(req.url, true);
		     var query = url_parts.query;
		     var startDate = '';
		    var endDate =''; 
		    var appId =''; 
		    var campaignId=query.campaignId
		    var searchquery = {};
		    if (startDate != '' && endDate != '') {
		        startDate = formatDate(startDate);
		        endDate = formatDate(endDate);
		        var dateq = { $gte: startDate, $lte: endDate };
		        searchquery.date = dateq;
		    } else if (startDate != '') {
		        startDate = formatDate(startDate);
		        var dateq = { $gte: startDate };
		        searchquery.date = dateq;
		    } else if (endDate != '') {
		        endDate = formatDate(endDate);
		        var dateq = { $lte: endDate };
		        searchquery.date = dateq;
		    } else {
		        var dateq = '';

		    }
		    if (appId != '') {
		        searchquery.appId = appId;
		    }
		    streamingadObj.find({ _id: campaignId }, { AdTitle: 1, AudioPricing: 1, BannerPricing: 1, Pricing: 1, TargetImpressions: 1, Advertiser: 1, PricingModel: 1, Category: 1, Duration: 1, createdOn: 1, _id: 1, startDate: 1, endDate: 1, attchedRO:1}, { sort: { startDate: -1 } }, function(err, campaignDetails) {
		            if (err) {
		                console.log('Error', err);
		            } else {
		            	//
		var searchquery2 = {};  
		searchquery2.campaignId=mongoose.Types.ObjectId(campaignId);       
      bundlenamereportObj.aggregate([
       { "$match": searchquery2 },
       { $project: { campaignId: "$campaignId", complete: "$complete", impression: "$impression", bundlename: "$bundlename", appId: "$appId", CompanionClickTracking: "$CompanionClickTracking" } }, 
       {
										$group: {
		                                        _id: "$bundlename",
		                                        "impression":{
													$sum: "$impression"
		                                        },
		                                        "complete":{
													$sum: "$complete"
		                                        },
		                                        "CompanionClickTracking": {
		                                            $sum: "$CompanionClickTracking"
		                                        }
		                                    }
		                                },
    ]).exec(function(err, datatotalOld) {
		                            if (err) {
		                                console.log('Err', err);
		                            } else {
                                outputJSON = {
		                                    'status': 'success',
		                                    'messageId': 200,
		                                    'message': constantObj.messages.successRetreivingData,
		                                    'reportingData': datatotalOld,
		                                    'campaignDetails': campaignDetails,
		                                    'campaignId': campaignId
		                                }
		                                res.jsonp(outputJSON);
		                            }
		                        });
		            }
		        });

		}
		exports.getlanguagereport = function(req, res) {
			var outputJSON = "";
		    var campaignReports = [];
		     var url_parts = url.parse(req.url, true);
		     var query = url_parts.query;
		     var startDate = '';
		    var endDate =''; 
		    var appId =''; 
		    var campaignId=query.campaignId
		    var searchquery = {};
		    if (startDate != '' && endDate != '') {
		        startDate = formatDate(startDate);
		        endDate = formatDate(endDate);
		        var dateq = { $gte: startDate, $lte: endDate };
		        searchquery.date = dateq;
		    } else if (startDate != '') {
		        startDate = formatDate(startDate);
		        var dateq = { $gte: startDate };
		        searchquery.date = dateq;
		    } else if (endDate != '') {
		        endDate = formatDate(endDate);
		        var dateq = { $lte: endDate };
		        searchquery.date = dateq;
		    } else {
		        var dateq = '';

		    }
		    if (appId != '') {
		        searchquery.appId = appId;
		    }
		    streamingadObj.find({ _id: campaignId }, { AdTitle: 1, AudioPricing: 1, BannerPricing: 1, Pricing: 1, TargetImpressions: 1, Advertiser: 1, PricingModel: 1, Category: 1, Duration: 1, createdOn: 1, _id: 1, startDate: 1, endDate: 1, attchedRO:1}, { sort: { startDate: -1 } }, function(err, campaignDetails) {
		            if (err) {
		                console.log('Error', err);
		            } else {
		            	//
		var searchquery2 = {};  
		searchquery2.campaignId=mongoose.Types.ObjectId(campaignId);       
      citylanguagereportObj.aggregate([
       { "$match": searchquery2 },
       { $project: { campaignId: "$campaignId", complete: "$complete", impression: "$impression", citylanguage: "$citylanguage", appId: "$appId", CompanionClickTracking: "$CompanionClickTracking" } }, 
       {
										$group: {
		                                        _id: "$citylanguage",
		                                        "impression":{
													$sum: "$impression"
		                                        },
		                                        "complete":{
													$sum: "$complete"
		                                        },
		                                        "CompanionClickTracking": {
		                                            $sum: "$CompanionClickTracking"
		                                        }
		                                    }
		                                },
    ]).exec(function(err, datatotalOld) {
		                            if (err) {
		                                console.log('Err', err);
		                            } else {
                                outputJSON = {
		                                    'status': 'success',
		                                    'messageId': 200,
		                                    'message': constantObj.messages.successRetreivingData,
		                                    'reportingData': datatotalOld,
		                                    'campaignDetails': campaignDetails,
		                                    'campaignId': campaignId
		                                }
		                                res.jsonp(outputJSON);
		                            }
		                        });
		            }
		        });

		}
		exports.getifareport = function(req, res) {
			var outputJSON = "";
		    var campaignReports = [];
		     var url_parts = url.parse(req.url, true);
		     var query = url_parts.query;
		     var startDate = '';
		    var endDate =''; 
		    var appId =''; 
		    var campaignId=query.campaignId
		    var searchquery = {};
		    if (startDate != '' && endDate != '') {
		        startDate = formatDate(startDate);
		        endDate = formatDate(endDate);
		        var dateq = { $gte: startDate, $lte: endDate };
		        searchquery.date = dateq;
		    } else if (startDate != '') {
		        startDate = formatDate(startDate);
		        var dateq = { $gte: startDate };
		        searchquery.date = dateq;
		    } else if (endDate != '') {
		        endDate = formatDate(endDate);
		        var dateq = { $lte: endDate };
		        searchquery.date = dateq;
		    } else {
		        var dateq = '';

		    }
		    if (appId != '') {
		        searchquery.appId = appId;
		    }
		    streamingadObj.find({ _id: campaignId }, { AdTitle: 1, AudioPricing: 1, BannerPricing: 1, Pricing: 1, TargetImpressions: 1, Advertiser: 1, PricingModel: 1, Category: 1, Duration: 1, createdOn: 1, _id: 1, startDate: 1, endDate: 1, attchedRO:1}, { sort: { startDate: -1 } }, function(err, campaignDetails) {
		            if (err) {
		                console.log('Error', err);
		            } else {
		            	//

	campaignifareportObj.distinct( "ifa", { campaignId: mongoose.Types.ObjectId(campaignId)}, function(err, datatotalOld) {
		 if (err) {
		                console.log('Error', err);
		            } else 
		            {
		            	

		            	 outputJSON = {
		                                    'status': 'success',
		                                    'messageId': 200,
		                                    'message': constantObj.messages.successRetreivingData,
		                                    'reportingData': datatotalOld.length,
		                                    'campaignDetails': campaignDetails,
		                                    'campaignId': campaignId
		                                }
		                                res.jsonp(outputJSON);
		            }
	});
	/*
		var searchquery2 = {};  
		//distinct( "item.sku", { dept: "A" } )
		searchquery2.campaignId=mongoose.Types.ObjectId(campaignId);       
      phonemakereportObj.aggregate([
       { "$match": searchquery2 },
       { $project: { campaignId: "$campaignId", ifa: "$ifa"} }, 
       {
										$group: {
		                                        _id: "$ifa",
		                                        total:{$sum:1}
		                                    }
		                                },
    ]).exec(function(err, datatotalOld) {
		                            if (err) {
		                                console.log('Err', err);
		                            } else {
                                outputJSON = {
		                                    'status': 'success',
		                                    'messageId': 200,
		                                    'message': constantObj.messages.successRetreivingData,
		                                    'reportingData': datatotalOld,
		                                    'campaignDetails': campaignDetails,
		                                    'campaignId': campaignId
		                                }
		                                res.jsonp(outputJSON);
		                            }
		                        }); */
		            }
		        });

		}

		exports.gettpreport = function(req, res) {
		    //console.log('In reporting...');
		    var outputJSON = "";
		    var campaignReports = [];
		    var isPaid = true;
		    var totalRows = 0;
		    var url_parts = url.parse(req.url, true);
		    var query = url_parts.query;
		    //var page = query.page;
		    //var count = parseInt(query.count);
		   
		    var startDate = '';//query.startdate;
		    var endDate =''; //query.enddate;
		    var appId =''; //query.appId;
		    var campaignId=query.campaignId
            //  var skip = parseInt(parseInt(page - 1) * parseInt(count));
		    //console.log('page', page);
		    //console.log('count', count);
		    //console.log('qstring', qstring);
		    var searchquery = {};
		    var searchquerynew = {};
		    if (startDate != '' && endDate != '') {
		        startDate = formatDate(startDate);
		        endDate = formatDate(endDate);
		        var dateq = { $gte: startDate, $lte: endDate };
		        searchquery.date = dateq;
		        searchquerynew.date = dateq;
		    } else if (startDate != '') {
		        startDate = formatDate(startDate);
		        var dateq = { $gte: startDate };
		        searchquery.date = dateq;
		        searchquerynew.date = dateq;
		    } else if (endDate != '') {
		        endDate = formatDate(endDate);
		        var dateq = { $lte: endDate };
		        searchquery.date = dateq;
		        searchquerynew.date = dateq;
		    } else {
		        var dateq = '';

		    }
		    if (appId != '') {
		        searchquery.appId = appId;
		        searchquerynew.appId = appId;
		    }
		        streamingadObj.find({ _id: campaignId }, { AdTitle: 1, AudioPricing: 1, BannerPricing: 1, Pricing: 1, TargetImpressions: 1, Advertiser: 1, PricingModel: 1, Category: 1, Duration: 1, createdOn: 1, _id: 1, startDate: 1, endDate: 1, attchedRO:1}, { sort: { startDate: -1 } }, function(err, campaignDetails) {
		            if (err) {
		                console.log('Error', err);
		            } else {
		                
		        var reqdata={};
		       reqdata.campaignId=mongoose.Types.ObjectId(campaignId);
		        campaignwisereportObj.aggregate([{ $match: reqdata },

		                    { $project: { campaignId:"$campaignId",appId:"$appId",date: "$date", requests: "$requests", ads: "$ads", impression: "$impression", servedAudioImpressions: "$servedAudioImpressions", servedCompanionAds: "$servedCompanionAds", completedAudioImpressions: "$completedAudioImpressions", CompanioncreativeView: "$CompanioncreativeView", CompanionClickTracking: "$CompanionClickTracking" } }, 
		                    
		                    {"$group":{
                                       "_id":{"appId":"$appId","date":"$date"},
                                       "total_impression":{"$sum":"$impression"},
                                       "total_clicks":{"$sum":"$CompanionClickTracking"},
        
                               }},
                               
						      
                               {"$group":{
						        "_id":"$_id.appId",
						        "v":{"$push":{"date":"$_id.date","total_impression":"$total_impression","total_clicks":"$total_clicks"}}
						      }}
		                ]

		            ).exec(function(err, datatotalOld) {
		                if (err) {
		                    console.log('Err', err);
		                } else {
		                    outputJSON = {
		                        'status': 'success',
		                        'messageId': 200,
		                        'message': constantObj.messages.successRetreivingData,
		                        'campaignDetails': campaignDetails,
		                        'reportingData': datatotalOld,
		                         'campaignIds': campaignId
		                    }
		                    res.jsonp(outputJSON);
		                }
		            });
                    }
		        });
		    


		}
		exports.jioreportingOld19sep18 = function(req, res) {
		    var outputJSON = "";
		    var campaignReports = [];
		    var isPaid = true;
		    var totalRows = 0;
		    var url_parts = url.parse(req.url, true);
		    var query = url_parts.query;
		    var startDate = query.startdate;
		    var endDate = query.enddate;
		    var appId = query.appId;
		    var searchquery = {};
		    var searchquerynew = {};
		    if (startDate != '' && endDate != '') {
		        startDate = formatDate(startDate);
		        endDate = formatDate(endDate);
		        var dateq = { $gte: startDate, $lte: endDate };
		        searchquery.date = dateq;
		        searchquerynew.date = dateq;
		    } else if (startDate != '') {
		        startDate = formatDate(startDate);
		        var dateq = { $gte: startDate };
		        searchquery.date = dateq;
		        searchquerynew.date = dateq;
		    } else if (endDate != '') {
		        endDate = formatDate(endDate);
		        var dateq = { $lte: endDate };
		        searchquery.date = dateq;
		        searchquerynew.date = dateq;
		    } else {
		        var dateq = '';
		    }
		    if (appId != '') {
		        searchquery.appId = appId;
		        searchquerynew.appId = appId;
		    }
		    paidCampaigns(appId, function(paidids) {
		        streamingadObj.find({ _id: { $in: paidids } }, { AdTitle: 1, AudioPricing: 1, BannerPricing: 1, Pricing: 1, TargetImpressions: 1, Advertiser: 1, PricingModel: 1, Category: 1, Duration: 1, createdOn: 1, _id: 1, startDate: 1, endDate: 1, attchedRO:1}, { sort: { startDate: -1 } }, function(err, campaignDetails) {
		            if (err) {
		                console.log('Error', err);
		            } else {
		                var pidinq = { $in: paidids };
		                searchquery.campaignId = pidinq;
		                datewisereportObj.aggregate([{ $match: searchquerynew },
		                        { $project: { requests: "$requests" } }, {
		                            $group: {
		                                _id: null,
		                                "requests": {
		                                    $sum: "$requests"
		                                }
		                            }
		                        }
		                    ]
		                ).exec(function(err, ddatasum) {
		                    if (err) {
		                        console.log('Err', err);
		                    } else {
		                        if (ddatasum != undefined && ddatasum != null && ddatasum.length > 0) {
		                            var countdata = ddatasum[0].requests;
		                        } else {
		                            var countdata = 0;
		                        }
		                campaignwisereportObj.aggregate([{ $match: searchquery },
		                        { $project: { campaignId: "$campaignId", requests: "$requests", ads: "$ads", servedAudioImpressions: "$servedAudioImpressions", servedCompanionAds: "$servedCompanionAds", completedAudioImpressions: "$completedAudioImpressions", CompanioncreativeView: "$CompanioncreativeView", CompanionClickTracking: "$CompanionClickTracking" } }, {
		                            $group: {
		                                _id: "$campaignId",
		                                "requests": {
		                                    $sum: "$requests"
		                                },
		                                "ads": {
		                                    $sum: "$ads"
		                                },
		                                "servedAudioImpressions": {
		                                    $sum: "$servedAudioImpressions"
		                                },
		                                "servedCompanionAds": {
		                                    $sum: "$servedCompanionAds"
		                                },
		                                "completedAudioImpressions": {
		                                    $sum: "$completedAudioImpressions"
		                                },
		                                "CompanioncreativeView": {
		                                    $sum: "$CompanioncreativeView"
		                                },
		                                "CompanionClickTracking": {
		                                    $sum: "$CompanionClickTracking"
		                                },
		                            }
		                        }
		                    ]
		                ).exec(function(err, datatotalOld) {
		                    if (err) {
		                        console.log('Err', err);
		                    } else {
		                        outputJSON = {
		                            'status': 'success',
		                            'messageId': 200,
		                            'message': constantObj.messages.successRetreivingData,
		                            'campaignDetails': campaignDetails,
		                            'datatotalOld': datatotalOld,
		                                    'campaignIds': paidids,
		                                    'countdata': countdata
		                        }
		                        res.jsonp(outputJSON);
		                            }
		                        });
		                    }
		                });
		            }
		        });
		    });
		}
