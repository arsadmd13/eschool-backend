window.addEventListener('message', event => {
	if (event.origin.startsWith('https://angry-babbage-4c01cb.netlify.app')) {
		document.getElementById('username').value = event.data;
	} else {
		return; 
	} 
}); 
let rtc;
(function(){
	var app = angular.module('projectRtc', [],
		function($locationProvider){$locationProvider.html5Mode(true);}
    );
	var client = new PeerManager();
	var mediaConfig = {
        audio:true,
        video: {
			mandatory: {},
			optional: []
        }
	};

    app.factory('camera', ['$rootScope', '$window', function($rootScope, $window){
    	var camera = {};
    	camera.preview = $window.document.getElementById('localVideo');

    	camera.start = function(){
			return requestUserMedia(mediaConfig)
			.then(function(stream){
				attachMediaStream(camera.preview, stream);
				client.setLocalStream(stream);
				camera.stream = stream;
				$rootScope.$broadcast('cameraIsOn',true);
			})
			.catch(Error('Failed to get access to local media.'));
		};
    	camera.stop = function(){
    		return new Promise(function(resolve, reject){
				try {
					//camera.stream.stop() no longer works
					camera.stream.getTracks().forEach(function(track) {
  					track.stop();
					});
					camera.preview.src = '';
					resolve();
				} catch(error) {
					reject(error);
				}
    		})
    		.then(function(result){
    			$rootScope.$broadcast('cameraIsOn',false);
    		});
		};
		return camera;
    }]);

	app.controller('RemoteStreamsController', ['camera', '$location', '$http', function(camera, $location, $http){
		comments = []
		var rtc = this;
		rtc.remoteStreams = [];
		//loadRtc(this);
		function getStreamById(id) {
		    for(var i=0; i<rtc.remoteStreams.length;i++) {
		    	if (rtc.remoteStreams[i].id === id) {return rtc.remoteStreams[i];}
		    }
		}
		rtc.loadData = function () {
			// get list of streams from the server
			$http.get('/streams.json').success(function(data){
				// filter own stream
				var streams = data.filter(function(stream) {
			      	return stream.id != client.getId();
			    });
			    // get former state
			    for(var i=0; i<streams.length;i++) {
			    	var stream = getStreamById(streams[i].id);
					streams[i].isPlaying = (!!stream) ? stream.isPLaying : false;
					if(document.getElementById('currentVideoId').value == streams[i].id){
						streams[i].class = '';
					} else {
						streams[i].class = 'hide';
					}
			    }
			    // save new streams
			    rtc.remoteStreams = streams;
			});
		};

		rtc.view = function(stream){
			client.peerInit(stream.id);
			stream.isPlaying = !stream.isPlaying;
			document.getElementById('currentVideoId').value = stream.id
			document.getElementById('commentListDiv').innerHTML = ""
			document.getElementById('alertDiv').innerHTML = ""
			document.getElementById(stream.id + 'check').classList.remove('hide')
			refreshComments(stream.id);
		};
		rtc.end = function(stream){
			document.getElementById('currentVideoId').value = ""
			document.getElementById(stream.id + 'check').classList.add('hide')
			location.reload();
			return;
		}
		rtc.onCommentAdded = function(){
			if(document.getElementById('currentVideoId').value == ""){
				document.getElementById('alertDiv').innerHTML = '<div class="alert alert-warning alert-dismissible fade show" role="alert">'
					+ '<strong>Warning : </strong> Make sure to join a live stream to comment!.'
					+ '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'
				  	+ '<span aria-hidden="true">&times;</span>'
					+ '</button>'
			  		+ '</div>';
				return;
			}
			if(document.getElementById('commentText').value == ""){
				document.getElementById('alertDiv').innerHTML = '<div class="alert alert-warning alert-dismissible fade show" role="alert">'
					+ '<strong>Warning : </strong> Make sure you fill the comments field.'
					+ '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'
				  	+ '<span aria-hidden="true">&times;</span>'
					+ '</button>'
			  		+ '</div>';
				return;
			}
			comment = {
				username: document.getElementById('username').value,
				message: document.getElementById('commentText').value,
				streamId: document.getElementById('currentVideoId').value
			};
			sendPostData(comment, client);
			// document.getElementById('commentListDiv').innerHTML += '<div class="comment" >'
			// 		  + '<h5>lllllll</h5>'
			// 		  + '<p>uio</p>'
			// 		  + '<hr>'
			// 		+ '</div>';
		}
		rtc.call = function(stream){
			//Do Nothing!
		}
		//rtc.call = function(stream){
			/* If json isn't loaded yet, construct a new stream
			 * This happens when you load <serverUrl>/<socketId> :
			 * it calls socketId immediatly.
			**/
		// 	if(!stream.id){
		// 		stream = {id: stream, isPlaying: false};
		// 		rtc.remoteStreams.push(stream);
		// 	}
		// 	if(camera.isOn){
		// 		client.toggleLocalStream(stream.id);
		// 		if(stream.isPlaying){
		// 			client.peerRenegociate(stream.id);
		// 		} else {
		// 			client.peerInit(stream.id);
		// 		}
		// 		stream.isPlaying = !stream.isPlaying;
		// 	} else {
		// 		camera.start()
		// 		.then(function(result) {
		// 			client.toggleLocalStream(stream.id);
		// 			if(stream.isPlaying){
		// 				client.peerRenegociate(stream.id);
		// 			} else {
		// 				client.peerInit(stream.id);
		// 			}
		// 			stream.isPlaying = !stream.isPlaying;
		// 		})
		// 		.catch(function(err) {
		// 			console.log(err);
		// 		});
		// 	}
		// };

		//initial load
		rtc.loadData();
    	if($location.url() != '/'){
      		rtc.call($location.url().slice(1));
    	};
	}]);

	app.controller('LocalStreamController',['camera', '$scope', '$window', function(camera, $scope, $window){
		var localStream = this;
		localStream.name = '';
		localStream.link = '';
		localStream.cameraIsOn = false;

		$scope.$on('cameraIsOn', function(event,data) {
    		$scope.$apply(function() {
		    	localStream.cameraIsOn = data;
		    });
		});

		localStream.toggleCam = function(){
			if(document.getElementById('lcn').value == ""){
				alert('Enter the faculty name or class name!')
				return;
			}
			var constraints = { audio: true, video: { width: 1280, height: 720 } };

			navigator.mediaDevices.getUserMedia(constraints)
			.then(function(mediaStream) {
			var video = document.querySelector('video');
			video.srcObject = mediaStream;
			video.onloadedmetadata = function(e) {
				video.play();
			};
			})

			if(localStream.cameraIsOn){
				camera.stop()
				.then(function(result){
					client.send('leave');
					client.setLocalStream(null);
					document.getElementById("lcn").disabled = false;
					document.getElementById('currentVideoId').value = "";
					document.getElementById('commentListDiv').innerHTML = ""
					document.getElementById('alertDiv').innerHTML = ""
						location.reload();
						return;
				})
				.catch(function(err) {
					console.log(err);
				});
			} else {
				var streamId = "";
				camera.start()
				.then(function(result) {
					localStream.link = $window.location.host + '/' + client.getId();
					streamId = client.getId();
					client.send('readyToStream', { name: localStream.name });
					document.getElementById("localVideo").classList.remove('hide');
					document.getElementById("lcn").disabled = true;
					document.getElementById('currentVideoId').value = streamId;
					document.getElementById('commentListDiv').innerHTML = ""
					document.getElementById('alertDiv').innerHTML = ""
					addStream()
				})
				.catch(function(err) {
					console.log(err);
				});
				client.send('RefreshStreams');				
			}
		};
	}]);
})();

var socket = io();
socket.on('AddComment', function(options) {
	//console.log(options);
	if(document.getElementById('currentVideoId').value == options.streamId)
		document.getElementById('commentListDiv').innerHTML += '<div class="comment" >'
			+ '<p class="commenttitle"><b>' + options.username + '</b></p>'
			+ '<p class="commentmsg">' + options.message + '</p>'
			+ '<hr>'
			+ '</div>';
});

function sendPostData(data, client){
	var http = new XMLHttpRequest();
	http.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var jsonres = JSON.parse(this.response);
			if(jsonres.status == 200){
				client.send('AddComment', comment)
				document.getElementById('commentText').value = document.getElementById('commentText').defaultValue
				document.getElementById('alertDiv').innerHTML = '<div class="alert alert-success alert-dismissible fade show" role="alert">'
						+ '<strong>Success : </strong> Comment Posted.'
						+ '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'
						+ '<span aria-hidden="true">&times;</span>'
						+ '</button>'
						+ '</div>';
			} else {
				document.getElementById('commentText').value = document.getElementById('commentText').defaultValue
				document.getElementById('alertDiv').innerHTML = '<div class="alert alert-danger alert-dismissible fade show" role="alert">'
						+ '<strong>Error : </strong> Unable to post your comment at the moment.'
						+ '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'
						+ '<span aria-hidden="true">&times;</span>'
						+ '</button>'
						+ '</div>';
			}
		}
	};
	http.open("POST", "/comment/add", true);
	http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	http.send("username=" + data.username + "&message=" + data.message + "&streamId=" + data.streamId);
}

function refreshComments(streamId){
	document.getElementById('alertDiv').innerHTML = '<div class="alert alert-warning alert-dismissible fade show" role="alert">'
						+ '<strong>Progress : </strong> Updating Comments...'
						+ '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'
						+ '<span aria-hidden="true">&times;</span>'
						+ '</button>'
						+ '</div>';
	var http = new XMLHttpRequest();
	http.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var jsonres = JSON.parse(this.response);
			if(jsonres.status == 200 || jsonres.status == 404){
				if(jsonres.comments != undefined){
					jsonres.comments.forEach((comment) => {
						document.getElementById('commentListDiv').innerHTML += '<div class="comment" >'
							+ '<p class="commenttitle"><b>' + comment.username + '</b></p>'
							+ '<p class="commentmsg">' + comment.message + '</p>'
							+ '<hr>'
							+ '</div>';
					})
				}
				document.getElementById('alertDiv').innerHTML = "";
			} else {
				document.getElementById('alertDiv').innerHTML = '<div class="alert alert-danger alert-dismissible fade show" role="alert">'
						+ '<strong>Error : </strong> Unable to update comment at the moment.'
						+ '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'
						+ '<span aria-hidden="true">&times;</span>'
						+ '</button>'
						+ '</div>';
			}
		}
	};
	http.open("POST", "/comment/read", true);
	http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	http.send("streamId=" + streamId);
}