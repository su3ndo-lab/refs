/*
	ptext.js
	Parse ptext block
	Version 0.0.5
	
	Sparisoma Viridi | https://github.com/dudung
		
	20200501
	1549 Start it triggered by U2 of FI3201-01 using jsxPhys.
	1716 Finish README for U2.
	19xx Create project at Github, learn Jekyll for blogging.
	yyyy Surrender to hack directyl to Github try local.
	
	20200501
	0738 Begin index.html according to this [1].
	xxxx Learn Jekyl.
	yyyy Postpone how to relates Jekyll _site and Github docs.
	
	20200503
	0637 Move from _posts to asset/js as recommended [2].
	0703 Rename parse3 to ptParseGraphs.
	0709 When changing body content it affect MathJax numbering.
	0742 Try with tags <ptext></ptext>
	0803 Fix it with getElementsByTagName, not body.innerHTML.
	0805 Add label and try to implement HTML anchor.
	0831 Put HTML anchor before graph for better view when refered.
	0859 Finish show numbering and testing form multiple refererrer.
	0910 Tested for multiple referrer and all work.
	1006 Can replace \ptref{label} to <ptref>label</ptref> but with
	     must change inner HTML that ruin MathJax numbering.
	1008 It works but inserting pText before MathJax in front matter.
	1626 Revert back to using tag <pref></pref> instead of \pref{}.
	1703 Finish writing inaccurate history.
	1707 Clean unused code, after vis all are removed, add version.
	1709 Copy to asset/js and test, edit only in x.y.z folder.
	1711 It works.
	1712 Begin verion 0.0.5 and make README in the folder.
	
	20200506
	0506 Found inconsistency in drawing.
	0525 Change input, e.g. 080 to 80, fix the result. Confuse.
	0531 Add version to chart object to differ different versions.
	
	References
	1. https://jekyllrb.com/docs/ [20200502].
	2. https://talk.jekyllrb.com/t
	   /add-custom-javascript-to-a-jekyll-page/789/2 [20200503]
*/


// Define global variables
var prefix = "graph";
var ptGraphs = [];


// Call some function to parse post content
window.onload = function() {
	ptGetParameters();
	ptCreateElements();
	ptCreateReferrers();
};


// Create referrers
function ptCreateReferrers() {
	var els = document.getElementsByTagName("ptref");
	
	var N = els.length;
	for(var i = 0; i < N; i++) {
		var s = els[i].innerHTML;
		
		var el = ptGraphs.find(option => option.label === s);
		
		var num = el.idx + 1;
		els[i].innerHTML = "<a href='#" + s
			+ "' style='font-weight: bold;'>"
			+ num + "</a>";
	}
}


// Create elements of pText graph
function ptCreateElements() {
	var N = ptGraphs.length;
	for(var i = 0; i < N; i++) {
		vis(prefix + i, ptGraphs[i]);
	}
}


// function get parameters between ptext tags, not nice but works
function ptGetParameters() {
	var els = document.getElementsByTagName("ptext");
	
	for(var i = 0; i < els.length; i++) {
		var obj = eval("(" + els[i].innerHTML + ")");
		obj.idx = i;
		ptGraphs.push(obj);
		els[i].innerHTML = "";
		var div = document.createElement("div");
		div.id = prefix + i;
		els[i].append(div);
	}	
}


// Visualize a graph from information between ptext tags
function vis() {
	var id = arguments[0];
	var arg = arguments[1];
	var x = arg.data.x;
	var y = arg.data.y;
	var N = Math.min(x.length, y.length);
	
	var type = arg.type;
	
	var div = document.getElementById(id);
	div.style.textAlign = "center";
	
	var ref = document.createElement("div");
	ref.innerHTML = "<a name = '" + arg.label + "'></a>";
	var cap = document.createElement("div");
	cap.innerHTML = "Figure " + (arg.idx + 1)
		+ " " + arg.caption;
	cap.style.paddingTop = "0.25em";
	
	var can = document.createElement("canvas");
	can.width = arg.width
	can.height = arg.height;
	can.style.width = can.width + "px";
	can.style.height = can.height + "px";
	can.style.background = arg.background;
	
	div.append(ref);
	div.append(can);
	div.append(cap);
	
	var version = arg.version;
	
	if(version == "0.0.8") {
		draw_v0_0_8();
	}

	function draw_v0_0_8() {
		var lc = arg.color.line;
		var pc = arg.color.point;
		
		var cx = can.getContext("2d");
		if(type == "line") {
			cx.strokeStyle = lc;
			cx.beginPath();
			for(var i = 0; i < N; i++) {
				if(i == 0) {
					cx.moveTo(x[i], y[i]);
				} else {
					cx.lineTo(x[i], y[i]);
				}
			}
			cx.stroke();
		} else if(type == "point") {
			cx.fillStyle = pc;
			for(var i = 0; i < N; i++) {
				cx.beginPath();
				cx.arc(x[i], y[i], 4, 0, 2 * Math.PI);
				cx.fill();
			}
		} else if(type == "line-point") {
			cx.strokeStyle = lc;
			cx.beginPath();
			for(var i = 0; i < N; i++) {
				if(i == 0) {
					cx.moveTo(x[i], y[i]);
				} else {
					cx.lineTo(x[i], y[i]);
				}
			}
			cx.stroke();
			cx.fillStyle = pc;
			for(var i = 0; i < N; i++) {
				cx.beginPath();
				cx.arc(x[i], y[i], 4, 0, 2 * Math.PI);
				cx.fill();
			}
		}
	}
}

