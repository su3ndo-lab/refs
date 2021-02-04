/*
	oo.js
	Parse oo element
	Version 0.0.1
	
	Sparisoma Viridi | https://github.com/dudung
	
	20200819
	0814 Start this project continuing ptext.
	0833 Recall [1] that seems similar to canvas commands [2].
	1922 Think and reject öoo or o0.öO or other variants.
	2149 Can show canvas with size and background color.
	2154 Can center canvas with div.
	20200820
	0913 Try to start again and doubt about SVG or canvas [3].
	0921 Start to develop primitive, about seven type [4].
	2124 Create SVG elements [5].
	20200822
	1848 Start again, not sure about style.
	20200823
	0736 Try to develop how to change style.
	0849 Can draw rectangle with style.
	1059 Change svg to width height background id.
	1153 Find error by updating style.
	1226 Solve previous problem but do not understand.
	1249 Begin polygon and polyline.
	1302 Problem fill of polygon. Solved.
	1333 Finish font but ommit path, since it is difficult.
	1430 Should change design by parsing text to SVG elements.
	1631 Get arrow head information [6], but not yet used.
	1707 Make function of createSVGObjects.
	1752 Can createStyle also for each object.
	1852 Pause for dinner.
	1927 Work createSVG container and objects.
	20200824
	0359 Try make arrow.
	20200901
	1314 Try to fix arrow head that only horizontal to right.
	1332 Can draw arrow in any direction.
	1339 Add new keyword caption but not yet work.
	1502 Can show caption and anchor using ooProcessElements().
	1706 Can no generate second oo section.
	1741 Fix the problem, variable shadowing in for iteration.
	1828 Design new keyword grid.
	
	References
	1. Paul Bourke, "PostScript Tutorial", Dec 1998, url
		 http://paulbourke.net/dataformats/postscript/ [20200819].
	2. url https://www.w3schools.com/tags/canvas_lineto.asp
		 [20200819].
	3. Chris Coyier, "When to Use SVG vs. When to Use Canvas",
		 CSS-Tricks, 12 Nov 2019, url https://css-tricks.com
		 /when-to-use-svg-vs-when-to-use-canvas/ [20200820].
	4. -, "SVG Shapes", url https://www.w3schools.com/graphics 
		 /svg_rect.asp [20200820].
	5. Xah Lee, "JS: Scripting SVG", 30 Mar 2020, url http://
		 xahlee.info/js/js_scritping_svg_basics.html [20200820].
	6. url http://thenewcode.com/1068/Making-Arrows-in-SVG
		 [20200823].
*/


// Define global variables
var oname = [];


// Call some function to parse post content
window.onload = function() {
	var oo = document.getElementsByTagName("oo");
	ooProcessElements(oo);
};


// Process oo elements
function ooProcessElements() {
	var oo = arguments[0];
	var divoo = [];
	if(oo.length > 0) {
		for(var ii = 0; ii < oo.length; ii++) {
			var div = document.createElement("div");
			div.style.textAlign = "center";
			var ooContent = oo[ii].innerHTML;
			oo[ii].innerHTML = "";
			oo[ii].appendChild(div);
			
			ooContent = removeFirstBlankLine(ooContent);
			var ooHeader = getSVGHeader(ooContent);
			var ooBody = getSVGBody(ooContent);
			
			var svg = createSVGContainer(ooHeader);
			div.appendChild(svg);
			
			var id = svg.getAttribute("id");
			oname.push(id);
			var capText = svg.getAttribute("cap");
			var i = oname.length;
			var iref = "<a name='" + oname[i - 1]
				+ "' + 'style:font-weight:bold;'>" + i + "</a>";
			var capDiv = document.createElement("div");
			capDiv.innerHTML = "Figure " + iref + " " + capText;
			div.append(capDiv);
			
			var ooBody2 = translateOoText(ooBody);
			
			var elems = createSVGObjects(ooBody2);
			for(var j = 0; j < elems.length; j++) {
				svg.appendChild(elems[j]);
			}
			
			divoo.push(div);
		}
	}
	return divoo;
}


/*
	translateOoText()
	
	20200823
	2025 Start this function.
	2039 Fix that forget to copy native command, !work.
	2047 Forget to put end of line, it works now.
*/
function translateOoText() {
	var lines = arguments[0].split("\n");
	var N = lines.length;
	var oo = "";
	for(var i = 0; i < N; i++) {
		var cols = lines[i].split(" ");
		
		if(cols[0] == "axis") {
			var x = parseInt(cols[1]);
			var y = parseInt(cols[2]);
			var mode = cols[3];
			oo += createAxisText(x, y, mode) + "\n";
		} else if(cols[0] == "arrow") { 
			var x1 = parseInt(cols[1]);
			var y1 = parseInt(cols[2]);
			var x2 = parseInt(cols[3]);
			var y2 = parseInt(cols[4]);
			oo += createArrowText(x1, y1, x2, y2) + "\n";
		} else if(cols[0] == "grid") {
			var x1 = parseInt(cols[1]);
			var y1 = parseInt(cols[2]);
			var x2 = parseInt(cols[3]);
			var y2 = parseInt(cols[4]);
			var sx = parseInt(cols[5]);
			var sy = parseInt(cols[6]);
			oo += createGridText(x1, y1, x2, y2, sx, sy) + "\n";
		} else {
			oo += lines[i] + "\n";
		}
	}
	return oo;
}


/*
	createGridText()
	
	20200901
	1830 Start this function.
*/
function createGridText() {
	var x1 = arguments[0];
	var y1 = arguments[1];
	var x2 = arguments[2];
	var y2 = arguments[3];
	var sx = arguments[4];
	var sy = arguments[5];
	var oo = "";
	
	for(var x = x1; x <= x2; x += sx) {
		oo += "line ";
		oo += x + " ";
		oo += y1 + " ";
		oo += x + " ";
		oo += y2 + "\n";
	}
	
	for(var y = y1; y <= y2; y += sy) {
		oo += "line ";
		oo += x1 + " ";
		oo += y + " ";
		oo += x2 + " ";
		oo += y + "\n";
	}
	
	return oo;
}

/*
	createArrowText()
	
	20200824
	0400 Start this function.
	0427 Error: <line> attribute x1: Expected length, "NaN".
	0443 Test it and working, pause for sholat.
	20200901
	1317 Define qo and calculate it from dy/dx.
	1327 Fix four main directions N, E, S, W.
	1332 Fix the other four NW, NE, SW SE.
*/
function createArrowText() {
	var x1 = arguments[0];
	var y1 = arguments[1];
	var x2 = arguments[2];
	var y2 = arguments[3];
	var oo = "";
	
	var dy = y2 - y1;
	var dx = x2 - x1;
	var qo;
	if(dx > 0 && dy == 0) {
		qo = 180;
	} else if(dx < 0 && dy == 0) {
		qo = 0;
	} else if(dx == 0 && dy < 0) {
		qo = 90;
	} else if(dx == 0 && dy > 0) {
		qo = -90;
	} else if(dx < 0) {
		qo = Math.atan(dy/dx) * 180 / Math.PI;
	} else if(dx > 0) {
		qo = 180 + Math.atan(dy/dx) * 180 / Math.PI;
	}
	
	var l = 12;
	var q = 14;
	var qu = (qo - q) * Math.PI / 180;
	var qd = (qo + q) * Math.PI / 180;
	var xu = Math.round(x2 + l * Math.cos(qu));
	var yu = Math.round(y2 + l * Math.sin(qu));
	var xd = Math.round(x2 + l * Math.cos(qd));
	var yd = Math.round(y2 + l * Math.sin(qd));
	
	oo += "line " + x1 + " " + y1 + " " + x2 + " " + y2 + "\n";
	var p = x2 + " " + y2 + " ";
	p += xu + " " + yu + " ";
	p += xd + " " + yd;
	oo += "polygon " + p + "\n";
	
	return oo;
}


/*
	createAxisText()
	
	20200823
	1939 Start this function.
	2018 Test and ok, change name from createSVGAxis.
*/
function createAxisText() {
	// Available modes: xy yz zx
	var x = arguments[0];
	var y = arguments[1];
	var mode = arguments[2];
	var oo = "";
	
	oo += "style fc:#fff fo:0 lo:0 ls:0\n";
	oo += "rect " + x + " " + y + " 50 50\n"
	oo += "style lc:#000 lo:1 fo:1\n";
	var x1 = x + 15;
	var y1 = y + 35;
	var x2 = x1 + 25;
	var y2 = y1;
	oo += "line " + x1 + " " + y1 + " " + x2 + " " + y2 + "\n";
	var x1 = x + 15;
	var y1 = y + 35;
	var x2 = x1;
	var y2 = y1 - 25;
	oo += "line " + x1 + " " + y1 + " " + x2 + " " + y2 + "\n";
	
	var s;
	if(mode == "xy") s = "xyz";
	if(mode == "yz") s = "yzx";
	if(mode == "zx") s = "zxy";
	oo += "style lo:0 fc:#000 ts:italic tf:times tz:12pt\n";
	var x1 = x + 20;
	var y1 = y + 30;
	oo += "text " + x1 + " " + y1 + " o\n";
	var x1 = x + 41;
	var y1 = y + 45;
	oo += "text " + x1 + " " + y1 + " " + s[0] + "\n";
	var x1 = x + 5;
	var y1 = y + 10;
	oo += "text " + x1 + " " + y1 + " " + s[1] + "\n";
	var x1 = x + 3;
	var y1 = y + 47;
	oo += "text " + x1 + " " + y1 + " " + s[2] + "\n";
	
	oo += "style lc:#000 fc:#fff lo:1\n"
	var x1 = x + 15;
	var y1 = y + 35;
	oo += "circle " + x1 + " " + y1 + " 4\n";
	
	oo += "style lc:#000 fc:#000\n";
	oo += "circle " + x1 + " " + y1 + " 1\n";
	var y1 = y + 10;
	oo += "circle " + x1 + " " + y1 + " 1\n";
	var x1 = x + 40;
	var y1 = y + 35;
	oo += "circle " + x1 + " " + y1 + " 1\n";
	
	return oo;
}


function createSVGContainer() {
	var line = arguments[0];
	var url = "http://www.w3.org/2000/svg";
	var svg = document.createElementNS(url, "svg");
	var info = line.split("|");
	var cols = info[0].split(" ");
	var w = parseInt(cols[1]);
	var h = parseInt(cols[2]);
	var c = cols[3];
	var id = cols[4];
	var cap = info[1];
	svg.setAttribute("width", w);
	svg.setAttribute("height", h);
	svg.setAttribute("style", "background:" + c);
	svg.setAttribute("id", id);
	svg.setAttribute("cap", cap);
	return svg;
}


function createSVGObjects() {
	var lines = arguments[0].split("\n");
	
	var obj, style = {};
	var oElement = [], oStyle = [];
	
	var N = lines.length;
	for(var i = 0; i < N; i++) {
		style = createSVGStyle(lines[i], style);
		obj = createSVGRect(lines[i], obj);
		obj = createSVGCircle(lines[i], obj);
		obj = createSVGEllipse(lines[i], obj);
		obj = createSVGLine(lines[i], obj);
		obj = createSVGPolygon(lines[i], obj);
		obj = createSVGPolyline(lines[i], obj);
		obj = createSVGText(lines[i], obj);
		
		if(obj != null) {
			for(var prop in style) {
				var p = "" + prop;
				var a = "" + style[prop];
				obj.setAttribute(p, a);
			}
			oElement.push(obj);
			obj = null;
		}

		if(obj != null) {
			oElement.push(obj);
			oStyle.push(style);
			obj = null;
		}
	}
	
	return oElement;
}


function removeFirstBlankLine() {
	var lines = arguments[0].split("\n");
	if(lines[0].length == 0) {
		lines = lines.slice(1);
	}
	return lines.join("\n");
}


function getSVGHeader() {
	var lines = arguments[0].split("\n");
	return lines[0];
}


function getSVGBody() {
	var lines = arguments[0].split("\n");
	return lines.slice(1).join("\n");
}


function createSVGStyle() {
	style = arguments[1];
	var cols = arguments[0].split(" ");
	var M = cols.length;
	if(cols[0] == "style") {
		for(var j = 1; j < M; j++) {
			var si = cols[j].split(":");
			switch(si[0]) {
			case "lc":
				style["stroke"] = si[1];
				break;
			case "lw":
				style["stroke-width"] = si[1];
				break;
			case "ls":
				var da = si[1].split("-").join(" ");
				style["stroke-dasharray"] = da;
				break;
			case "lo":
				style["stroke-opacity"] = si[1];
				break;
			case "fc":
				style["fill"] = si[1];
				break;
			case "fo":
				style["fill-opacity"] = si[1];
				break;
			case "id":
				style["id"] = si[1];
				break;
			case "tf":
				var ff = si[1].split("-").join(" ");
				style["font-family"] = ff;
				break;
			case "ts":
				style["font-style"] = si[1];
				break;
			case "tw":
				style["font-weight"] = si[1];
				break;
			case "tz":
				style["font-size"] = si[1];
				break;
			}
		}
	}
	return style;
}


function createSVGRect() {
	var obj = arguments[1];
	var cols = arguments[0].split(" ");
	if(cols[0] == "rect") {
	var url = "http://www.w3.org/2000/svg";
	obj = document.createElementNS(url, "rect");
	var M = cols.length;
		if(M == 3) {
			var w = parseInt(cols[1]);
			var h = parseInt(cols[2]);
			obj.setAttribute("width", w);
			obj.setAttribute("height", h);
		}
		if(M == 5) {
			var x = parseInt(cols[1]);
			var y = parseInt(cols[2]);
			var w = parseInt(cols[3]);
			var h = parseInt(cols[4]);
			obj.setAttribute("x", x);
			obj.setAttribute("y", y);
			obj.setAttribute("width", w);
			obj.setAttribute("height", h);
		}
		if(M == 7) {
			var x = parseInt(cols[1]);
			var y = parseInt(cols[2]);
			var rx = parseInt(cols[3]);
			var ry = parseInt(cols[4]);
			var w = parseInt(cols[5]);
			var h = parseInt(cols[6]);
			obj.setAttribute("x", x);
			obj.setAttribute("y", y);
			obj.setAttribute("rx", rx);
			obj.setAttribute("ry", ry);
			obj.setAttribute("width", w);
			obj.setAttribute("height", h);
		}
	}
	return obj;
}


function createSVGCircle() {
	var obj = arguments[1];
	var cols = arguments[0].split(" ");
	if(cols[0] == "circle") {
		var url = "http://www.w3.org/2000/svg";
		obj = document.createElementNS(url, "circle");
		var cx = parseInt(cols[1]);
		var cy = parseInt(cols[2]);
		var r = parseInt(cols[3]);
		obj.setAttribute("cx", cx);
		obj.setAttribute("cy", cy);
		obj.setAttribute("r", r);
	}
	return obj;
}


function createSVGEllipse() {
	var obj = arguments[1];
	var cols = arguments[0].split(" ");
	if(cols[0] == "ellipse") {
		var url = "http://www.w3.org/2000/svg";
		obj = document.createElementNS(url, "ellipse");
		var cx = parseInt(cols[1]);
		var cy = parseInt(cols[2]);
		var rx = parseInt(cols[3]);
		var ry = parseInt(cols[4]);
		obj.setAttribute("cx", cx);
		obj.setAttribute("cy", cy);
		obj.setAttribute("rx", rx);
		obj.setAttribute("ry", ry);
	}
	return obj;
}


function createSVGLine() {
	var obj = arguments[1];
	var cols = arguments[0].split(" ");
	if(cols[0] == "line") {
		var url = "http://www.w3.org/2000/svg";
		obj = document.createElementNS(url, "line");
		var x1 = parseInt(cols[1]);
		var y1 = parseInt(cols[2]);
		var x2 = parseInt(cols[3]);
		var y2 = parseInt(cols[4]);
		obj.setAttribute("x1", x1);
		obj.setAttribute("y1", y1);
		obj.setAttribute("x2", x2);
		obj.setAttribute("y2", y2);
	}
	return obj;
}


function createSVGPolygon() {
	var obj = arguments[1];
	var cols = arguments[0].split(" ");
	if(cols[0] == "polygon") {
		var url = "http://www.w3.org/2000/svg";
		obj = document.createElementNS(url, "polygon");
		var points = [];
		var M = cols.length;
		var L = (M - 1) / 2;
		for(var l = 0; l < L; l++) {
			var x = cols[l * 2 + 1];
			var y = cols[l * 2 + 2];
			var xy = x + "," + y;
			points.push(xy);
		}
		obj.setAttribute("points", points.join(" "));
	}
	return obj;
}


function createSVGPolyline() {
	var obj = arguments[1];
	var cols = arguments[0].split(" ");
	if(cols[0] == "polyline") {
		var url = "http://www.w3.org/2000/svg";
		obj = document.createElementNS(url, "polyline");
		var points = [];
		var M = cols.length;
		var L = (M - 1) / 2;
		for(var l = 0; l < L; l++) {
			var x = cols[l * 2 + 1];
			var y = cols[l * 2 + 2];
			var xy = x + "," + y;
			points.push(xy);
		}
		obj.setAttribute("points", points.join(" "));
	}
	return obj;
}


function createSVGText() {
	var obj = arguments[1];
	var cols = arguments[0].split(" ");
	if(cols[0] == "text") {
		var url = "http://www.w3.org/2000/svg";
		obj = document.createElementNS(url, "text");
		var x = parseInt(cols[1]);
		var y = parseInt(cols[2]);
		var t = cols[3];
		obj.setAttribute("x", x);
		obj.setAttribute("y", y);
		obj.innerHTML = cols.slice(3).join(" ");
	}
	return obj;
}


	/*
	ooBody = "";
	ooBody += createAxisText(50, 0, "xy") + "\n";
	ooBody += createAxisText(150, 50, "yz") + "\n";
	ooBody += createAxisText(250, 100, "zx") + "\n";
	*/


// 20200823.1936
function createSVGAxis_20200823_1936() {
	var ooText = `
style fc:#fff
rect 0 100 50 50

style lc:#000
line 15 135 40 135
line 15 135 15 110

style lo:0 fc:#000 ts:italic tf:times tz:12pt
text 3 147 z
text 41 145 x
text 5 110 y
text 20 130 o

style lc:#000 fc:#fff lo:1
circle 15 135 4

style lc:#000 fc:#000
circle 15 135 1
circle 15 110 1
circle 40 135 1
`;
	return ooText;
}


// url https://stackoverflow.com/a/62983322/9475509 [20200823].
function isEmptyObject(obj) {
  return !!obj && Object.keys(obj).length === 0 && obj.constructor === Object;
}


// Draw some SVG elements
function drawSVG() {
	var content = arguments[0];
	var div = arguments[1];
	var url = "http://www.w3.org/2000/svg";
	var svg = document.createElementNS(url, "svg");
	div.appendChild(svg);
	
	var obj, style = {};
	var oElement = [], oStyle = [];
	
	var lines = content.split("\n");
	var N = lines.length;
	for(var i = 0; i < N; i++) {
		
		if(lines[i].indexOf("svg") == 0) {
			var cols = lines[i].split(" ");
			var w = parseInt(cols[1]);
			var h = parseInt(cols[2]);
			var c = cols[3];
			var id = cols[4];
			svg.setAttribute("width", w);
			svg.setAttribute("height", h);
			svg.setAttribute("style", "background:" + c);
			svg.setAttribute("id", id);
		}
		
		style = createSVGStyle(lines[i], style);
		obj = createSVGRect(lines[i], obj);
		obj = createSVGCircle(lines[i], obj);
		obj = createSVGEllipse(lines[i], obj);
		obj = createSVGLine(lines[i], obj);
		obj = createSVGPolygon(lines[i], obj);
		obj = createSVGPolyline(lines[i], obj);
		obj = createSVGText(lines[i], obj);
		
		oElement.push(obj);
		oStyle.push(style);
		
		if(obj != null) {
			svg.appendChild(obj);
			for(var prop in style) {
				var p = "" + prop;
				var a = "" + style[prop];
				obj.setAttribute(p, a);
			}
			obj = null;
		}
	}
}


/*
<!--
<oo>
svg 300 150 #f0f0f0 fig:example

style fc:#fff
rect 0 100 50 50

style lc:#000
line 15 135 40 135
line 15 135 15 110

style lo:0 fc:#000 ts:italic tf:times tz:12pt
text 3 147 z
text 41 145 x
text 5 110 y
text 20 130 o

style lc:#000 fc:#fff lo:1
circle 15 135 4

style lc:#000 fc:#000
circle 15 135 1
circle 15 110 1
circle 40 135 1
</oo>
-->

<!--
<oo>
svg 300 150 #eee fig:example

style lc:#f00 lw:6 ls:9-2-6-1 lo:0.5 fc:#fcc fo:0.9 id:boo
rect 10 20 10 10 90 120

style lc:#0f0 lw:2 ls:3-1 lo:0.5 fc:#fcf fo:0.9
rect 80 40 100 80

style lc:#00f lw:2 ls:3-1 lo:0.5 fc:#fcf fo:0.9
rect 40 15

style lc:#f0f lw:2 fo:0
circle 200 100 40

style lc:#ff0 lw:2 fo:0
ellipse 150 75 60 30

style lc:#900 lw:2 ls:6-1
line 40 50 290 140

style lc:#0a0 lw:2 ls:0 fc:#fff fo:0.5
polygon 200 50 220 50 220 80 180 80

style lc:#090 lw:4 ls:0 fc:#fff fo:0.0
polyline 0 40 240 40 240 80 280 80

style fc:#000 tf:Times ts:italic tz:12pt
text 200 100 x
</oo>

rectangle 10 20 5 5 100 150
circle 20 20 10
ellipse 30 40 10 20
line 40 50 60 70
polygon 10 10 20 10 40 0 50 20
polyline 0 40 40 40 40 80 80 80
path
text 20 20 black "SVG text""
-->
*/


/*
// 20200823
	if(cols[0] == "bgcolor") {
		var r = parseFloat(cols[1]);
		var g = parseFloat(cols[2]);
		var b = parseFloat(cols[3]);
		r = ("0" + Math.floor(r * 255).toString(16)).slice(-2);
		g = ("0" + Math.floor(g * 255).toString(16)).slice(-2);
		b = ("0" + Math.floor(b * 255).toString(16)).slice(-2);
		var color = "#" + r + g + b;
		svg.setAttribute("style", "background:" + color);
	}

From 20200819
<oo>
(fig:axis-1) setlabel
0 0 300 200 setcanvas
0.99 0.99 0.99 setbackground

newpath
0 0 1 setrgbcolor
newpath
10 10 moveto
90 10 lineto
90 90 lineto
10 90 lineto
closepath
fill

2 setlinewidth
1 0 0 setrgbcolor
newpath
10 10 moveto
90 10 lineto
90 90 lineto
10 90 lineto
closepath
stroke
</oo>
*/


// Parse oo element with canvas -- only empty canvas
function ooParseElementWithCanvas() {
	var oo = arguments[0];
	var content = oo.innerHTML;
	
	var w, h;
	[ , , w, h] = ooGetValues("setcanvas", content);
	var r, g, b;
	[r, g, b] = ooGetValues("setbackground", content);
	
	var bgc = "#"
		+ ("0" + (Math.floor(r * 255)).toString(16)).slice(-2)
		+ ("0" + (Math.floor(g * 255)).toString(16)).slice(-2)
		+ ("0" + (Math.floor(b * 255)).toString(16)).slice(-2);
	console.log(bgc);
	
	var can = document.createElement("canvas");
	can.width = w;
	can.style.width = w + "px";
	can.height = h;
	can.style.height = h + "px";
	can.style.background = bgc;
	
	return can;
}


// Get values from postscrit style, the last is keyword
function ooGetValues() {
	var key = arguments[0];
	var lines = arguments[1].split("\n");
	var N = lines.length;
	var val = [];
	for(var i = 0; i < N; i++) {
		var cols = lines[i].split(" ");
		var M = cols.length;
		if(cols[M - 1] == key) {
			for(var j = 0; j < M - 1; j++) {
				val.push(parseFloat(cols[j]));
			}
		}
	}
	return val;
}


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


// function get parameters between tags, not nice but works
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
