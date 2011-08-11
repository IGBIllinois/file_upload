/*1.4.3.2*/
(function() {
	var f = 0, l = [], n = {}, j = {}, a = {
		"<" : "lt",
		">" : "gt",
		"&" : "amp",
		'"' : "quot",
		"'" : "#39"
	}, m = /[<>&\"\']/g, b, c = window.setTimeout, d = {}, e;
	function h() {
		this.returnValue = false
	}
	function k() {
		this.cancelBubble = true
	}
	(function(o) {
		var p = o.split(/,/), q, s, r;
		for (q = 0; q < p.length; q += 2) {
			r = p[q + 1].split(/ /);
			for (s = 0; s < r.length; s++) {
				j[r[s]] = p[q]
			}
		}
	})
			("application/msword,doc dot,application/pdf,pdf,application/pgp-signature,pgp,application/postscript,ps ai eps,application/rtf,rtf,application/vnd.ms-excel,xls xlb,application/vnd.ms-powerpoint,ppt pps pot,application/zip,zip,application/x-shockwave-flash,swf swfl,application/vnd.openxmlformats,docx pptx xlsx,audio/mpeg,mpga mpega mp2 mp3,audio/x-wav,wav,audio/mp4,m4a,image/bmp,bmp,image/gif,gif,image/jpeg,jpeg jpg jpe,image/png,png,image/svg+xml,svg svgz,image/tiff,tiff tif,text/html,htm html xhtml,text/rtf,rtf,video/mpeg,mpeg mpg mpe,video/quicktime,qt mov,video/mp4,mp4,video/x-m4v,m4v,video/x-flv,flv,video/vnd.rn-realvideo,rv,text/plain,asc txt text diff log,application/octet-stream,exe");
	var g = {
		VERSION : "1.4.3.2",
		STOPPED : 1,
		STARTED : 2,
		QUEUED : 1,
		UPLOADING : 2,
		FAILED : 4,
		DONE : 5,
		GENERIC_ERROR : -100,
		HTTP_ERROR : -200,
		IO_ERROR : -300,
		SECURITY_ERROR : -400,
		INIT_ERROR : -500,
		FILE_SIZE_ERROR : -600,
		FILE_EXTENSION_ERROR : -601,
		IMAGE_FORMAT_ERROR : -700,
		IMAGE_MEMORY_ERROR : -701,
		IMAGE_DIMENSIONS_ERROR : -702,
		mimeTypes : j,
		extend : function(o) {
			g.each(arguments, function(p, q) {
				if (q > 0) {
					g.each(p, function(s, r) {
						o[r] = s
					})
				}
			});
			return o
		},
		cleanName : function(o) {
			var p, q;
			q = [ /[\300-\306]/g, "A", /[\340-\346]/g, "a", /\307/g, "C",
					/\347/g, "c", /[\310-\313]/g, "E", /[\350-\353]/g, "e",
					/[\314-\317]/g, "I", /[\354-\357]/g, "i", /\321/g, "N",
					/\361/g, "n", /[\322-\330]/g, "O", /[\362-\370]/g, "o",
					/[\331-\334]/g, "U", /[\371-\374]/g, "u" ];
			for (p = 0; p < q.length; p += 2) {
				o = o.replace(q[p], q[p + 1])
			}
			o = o.replace(/\s+/g, "_");
			o = o.replace(/[^a-z0-9_\-\.]+/gi, "");
			return o
		},
		addRuntime : function(o, p) {
			p.name = o;
			l[o] = p;
			l.push(p);
			return p
		},
		guid : function() {
			var o = new Date().getTime().toString(32), p;
			for (p = 0; p < 5; p++) {
				o += Math.floor(Math.random() * 65535).toString(32)
			}
			return (g.guidPrefix || "p") + o + (f++).toString(32)
		},
		buildUrl : function(p, o) {
			var q = "";
			g.each(o, function(s, r) {
				q += (q ? "&" : "") + encodeURIComponent(r) + "="
						+ encodeURIComponent(s)
			});
			if (q) {
				p += (p.indexOf("?") > 0 ? "&" : "?") + q
			}
			return p
		},
		each : function(r, s) {
			var q, p, o;
			if (r) {
				q = r.length;
				if (q === b) {
					for (p in r) {
						if (r.hasOwnProperty(p)) {
							if (s(r[p], p) === false) {
								return
							}
						}
					}
				} else {
					for (o = 0; o < q; o++) {
						if (s(r[o], o) === false) {
							return
						}
					}
				}
			}
		},
		formatSize : function(o) {
			if (o === b || /\D/.test(o)) {
				return g.translate("N/A")
			}
			if (o > 1073741824) {
				return Math.round(o / 1073741824, 1) + " GB"
			}
			if (o > 1048576) {
				return Math.round(o / 1048576, 1) + " MB"
			}
			if (o > 1024) {
				return Math.round(o / 1024, 1) + " KB"
			}
			return o + " b"
		},
		getPos : function(p, t) {
			var u = 0, s = 0, w, v = document, q, r;
			p = p;
			t = t || v.body;
			function o(C) {
				var A, B, z = 0, D = 0;
				if (C) {
					B = C.getBoundingClientRect();
					A = v.compatMode === "CSS1Compat" ? v.documentElement
							: v.body;
					z = B.left + A.scrollLeft;
					D = B.top + A.scrollTop
				}
				return {
					x : z,
					y : D
				}
			}
			if (p
					&& p.getBoundingClientRect
					&& (navigator.userAgent.indexOf("MSIE") > 0 && v.documentMode !== 8)) {
				q = o(p);
				r = o(t);
				return {
					x : q.x - r.x,
					y : q.y - r.y
				}
			}
			w = p;
			while (w && w != t && w.nodeType) {
				u += w.offsetLeft || 0;
				s += w.offsetTop || 0;
				w = w.offsetParent
			}
			w = p.parentNode;
			while (w && w != t && w.nodeType) {
				u -= w.scrollLeft || 0;
				s -= w.scrollTop || 0;
				w = w.parentNode
			}
			return {
				x : u,
				y : s
			}
		},
		getSize : function(o) {
			return {
				w : o.offsetWidth || o.clientWidth,
				h : o.offsetHeight || o.clientHeight
			}
		},
		parseSize : function(o) {
			var p;
			if (typeof (o) == "string") {
				o = /^([0-9]+)([mgk]+)$/.exec(o.toLowerCase().replace(
						/[^0-9mkg]/g, ""));
				p = o[2];
				o = +o[1];
				if (p == "g") {
					o *= 1073741824
				}
				if (p == "m") {
					o *= 1048576
				}
				if (p == "k") {
					o *= 1024
				}
			}
			return o
		},
		xmlEncode : function(o) {
			return o ? ("" + o).replace(m, function(p) {
				return a[p] ? "&" + a[p] + ";" : p
			}) : o
		},
		toArray : function(q) {
			var p, o = [];
			for (p = 0; p < q.length; p++) {
				o[p] = q[p]
			}
			return o
		},
		addI18n : function(o) {
			return g.extend(n, o)
		},
		translate : function(o) {
			return n[o] || o
		},
		isEmptyObj : function(o) {
			if (o === b) {
				return true
			}
			for ( var p in o) {
				return false
			}
			return true
		},
		hasClass : function(q, p) {
			var o;
			if (q.className == "") {
				return false
			}
			o = new RegExp("(^|\\s+)" + p + "(\\s+|$)");
			return o.test(q.className)
		},
		addClass : function(p, o) {
			if (!g.hasClass(p, o)) {
				p.className = p.className == "" ? o : p.className.replace(
						/\s+$/, "")
						+ " " + o
			}
		},
		removeClass : function(q, p) {
			var o = new RegExp("(^|\\s+)" + p + "(\\s+|$)");
			q.className = q.className.replace(o, function(s, r, t) {
				return r === " " && t === " " ? " " : ""
			})
		},
		getStyle : function(p, o) {
			if (p.currentStyle) {
				return p.currentStyle[o]
			} else {
				if (window.getComputedStyle) {
					return window.getComputedStyle(p, null)[o]
				}
			}
		},
		addEvent : function(t, o, u) {
			var s, r, q, p;
			p = arguments[3];
			o = o.toLowerCase();
			if (e === b) {
				e = "Plupload_" + g.guid()
			}
			if (t.attachEvent) {
				s = function() {
					var v = window.event;
					if (!v.target) {
						v.target = v.srcElement
					}
					v.preventDefault = h;
					v.stopPropagation = k;
					u(v)
				};
				t.attachEvent("on" + o, s)
			} else {
				if (t.addEventListener) {
					s = u;
					t.addEventListener(o, s, false)
				}
			}
			if (t[e] === b) {
				t[e] = g.guid()
			}
			if (!d.hasOwnProperty(t[e])) {
				d[t[e]] = {}
			}
			r = d[t[e]];
			if (!r.hasOwnProperty(o)) {
				r[o] = []
			}
			r[o].push({
				func : s,
				orig : u,
				key : p
			})
		},
		removeEvent : function(t, o) {
			var r, u, q;
			if (typeof (arguments[2]) == "function") {
				u = arguments[2]
			} else {
				q = arguments[2]
			}
			o = o.toLowerCase();
			if (t[e] && d[t[e]] && d[t[e]][o]) {
				r = d[t[e]][o]
			} else {
				return
			}
			for ( var p = r.length - 1; p >= 0; p--) {
				if (r[p].key === q || r[p].orig === u) {
					if (t.detachEvent) {
						t.detachEvent("on" + o, r[p].func)
					} else {
						if (t.removeEventListener) {
							t.removeEventListener(o, r[p].func, false)
						}
					}
					r[p].orig = null;
					r[p].func = null;
					r.splice(p, 1);
					if (u !== b) {
						break
					}
				}
			}
			if (!r.length) {
				delete d[t[e]][o]
			}
			if (g.isEmptyObj(d[t[e]])) {
				delete d[t[e]];
				try {
					delete t[e]
				} catch (s) {
					t[e] = b
				}
			}
		},
		removeAllEvents : function(p) {
			var o = arguments[1];
			if (p[e] === b || !p[e]) {
				return
			}
			g.each(d[p[e]], function(r, q) {
				g.removeEvent(p, q, o)
			})
		}
	};
	g.Uploader = function(r) {
		var p = {}, u, t = [], q;
		u = new g.QueueProgress();
		r = g.extend({
			chunk_size : 0,
			multipart : true,
			multi_selection : true,
			file_data_name : "file",
			filters : []
		}, r);
		function s() {
			var w, x = 0, v;
			if (this.state == g.STARTED) {
				for (v = 0; v < t.length; v++) {
					if (!w && t[v].status == g.QUEUED) {
						w = t[v];
						w.status = g.UPLOADING;
						this.trigger("BeforeUpload", w);
						this.trigger("UploadFile", w)
					} else {
						x++
					}
				}
				if (x == t.length) {
					this.trigger("UploadComplete", t);
					this.stop()
				}
			}
		}
		function o() {
			var w, v;
			u.reset();
			for (w = 0; w < t.length; w++) {
				v = t[w];
				if (v.size !== b) {
					u.size += v.size;
					u.loaded += v.loaded
				} else {
					u.size = b
				}
				if (v.status == g.DONE) {
					u.uploaded++
				} else {
					if (v.status == g.FAILED) {
						u.failed++
					} else {
						u.queued++
					}
				}
			}
			if (u.size === b) {
				u.percent = t.length > 0 ? Math.ceil(u.uploaded / t.length
						* 100) : 0
			} else {
				u.bytesPerSec = Math.ceil(u.loaded
						/ ((+new Date() - q || 1) / 1000));
				u.percent = u.size > 0 ? Math.ceil(u.loaded / u.size * 100) : 0
			}
		}
		g.extend(this, {
			state : g.STOPPED,
			runtime : "",
			features : {},
			files : t,
			settings : r,
			total : u,
			id : g.guid(),
			init : function() {
				var A = this, B, x, w, z = 0, y;
				if (typeof (r.preinit) == "function") {
					r.preinit(A)
				} else {
					g.each(r.preinit, function(D, C) {
						A.bind(C, D)
					})
				}
				r.page_url = r.page_url
						|| document.location.pathname
								.replace(/\/[^\/]+$/g, "/");
				if (!/^(\w+:\/\/|\/)/.test(r.url)) {
					r.url = r.page_url + r.url
				}
				r.chunk_size = g.parseSize(r.chunk_size);
				r.max_file_size = g.parseSize(r.max_file_size);
				A.bind("FilesAdded", function(C, F) {
					var E, D, H = 0, I, G = r.filters;
					if (G && G.length) {
						I = [];
						g.each(G, function(J) {
							g.each(J.extensions.split(/,/), function(K) {
								if (/^\s*\*\s*$/.test(K)) {
									I.push("\\.*")
								} else {
									I.push("\\."
											+ K.replace(new RegExp("["
													+ ("/^$.*+?|()[]{}\\"
															.replace(/./g,
																	"\\$&"))
													+ "]", "g"), "\\$&"))
								}
							})
						});
						I = new RegExp(I.join("|") + "$", "i")
					}
					for (E = 0; E < F.length; E++) {
						D = F[E];
						D.loaded = 0;
						D.percent = 0;
						D.status = g.QUEUED;
						if (I && !I.test(D.name)) {
							C.trigger("Error", {
								code : g.FILE_EXTENSION_ERROR,
								message : g.translate("File extension error."),
								file : D
							});
							continue
						}
						if (D.size !== b && D.size > r.max_file_size) {
							C.trigger("Error", {
								code : g.FILE_SIZE_ERROR,
								message : g.translate("File size error."),
								file : D
							});
							continue
						}
						t.push(D);
						H++
					}
					if (H) {
						c(function() {
							A.trigger("QueueChanged");
							A.refresh()
						}, 1)
					} else {
						return false
					}
				});
				if (r.unique_names) {
					A.bind("UploadFile", function(C, D) {
						var F = D.name.match(/\.([^.]+)$/), E = "tmp";
						if (F) {
							E = F[1]
						}
						D.target_name = D.id + "." + E
					})
				}
				A.bind("UploadProgress", function(C, D) {
					D.percent = D.size > 0 ? Math.ceil(D.loaded / D.size * 100)
							: 100;
					o()
				});
				A.bind("StateChanged", function(C) {
					if (C.state == g.STARTED) {
						q = (+new Date())
					} else {
						if (C.state == g.STOPPED) {
							for (B = C.files.length - 1; B >= 0; B--) {
								if (C.files[B].status == g.UPLOADING) {
									C.files[B].status = g.QUEUED;
									o()
								}
							}
						}
					}
				});
				A.bind("QueueChanged", o);
				A.bind("Error", function(C, D) {
					if (D.file) {
						D.file.status = g.FAILED;
						o();
						if (C.state == g.STARTED) {
							c(function() {
								s.call(A)
							}, 1)
						}
					}
				});
				A.bind("FileUploaded", function(C, D) {
					D.status = g.DONE;
					D.loaded = D.size;
					C.trigger("UploadProgress", D);
					c(function() {
						s.call(A)
					}, 1)
				});
				if (r.runtimes) {
					x = [];
					y = r.runtimes.split(/\s?,\s?/);
					for (B = 0; B < y.length; B++) {
						if (l[y[B]]) {
							x.push(l[y[B]])
						}
					}
				} else {
					x = l
				}
				function v() {
					var F = x[z++], E, C, D;
					if (F) {
						E = F.getFeatures();
						C = A.settings.required_features;
						if (C) {
							C = C.split(",");
							for (D = 0; D < C.length; D++) {
								if (!E[C[D]]) {
									v();
									return
								}
							}
						}
						F.init(A, function(G) {
							if (G && G.success) {
								A.features = E;
								A.runtime = F.name;
								A.trigger("Init", {
									runtime : F.name
								});
								A.trigger("PostInit");
								A.refresh()
							} else {
								v()
							}
						})
					} else {
						A.trigger("Error", {
							code : g.INIT_ERROR,
							message : g.translate("Init error.")
						})
					}
				}
				v();
				if (typeof (r.init) == "function") {
					r.init(A)
				} else {
					g.each(r.init, function(D, C) {
						A.bind(C, D)
					})
				}
			},
			refresh : function() {
				this.trigger("Refresh")
			},
			start : function() {
				if (this.state != g.STARTED) {
					this.state = g.STARTED;
					this.trigger("StateChanged");
					s.call(this)
				}
			},
			stop : function() {
				if (this.state != g.STOPPED) {
					this.state = g.STOPPED;
					this.trigger("StateChanged")
				}
			},
			getFile : function(w) {
				var v;
				for (v = t.length - 1; v >= 0; v--) {
					if (t[v].id === w) {
						return t[v]
					}
				}
			},
			removeFile : function(w) {
				var v;
				for (v = t.length - 1; v >= 0; v--) {
					if (t[v].id === w.id) {
						return this.splice(v, 1)[0]
					}
				}
			},
			splice : function(x, v) {
				var w;
				w = t.splice(x === b ? 0 : x, v === b ? t.length : v);
				this.trigger("FilesRemoved", w);
				this.trigger("QueueChanged");
				return w
			},
			trigger : function(w) {
				var y = p[w.toLowerCase()], x, v;
				if (y) {
					v = Array.prototype.slice.call(arguments);
					v[0] = this;
					for (x = 0; x < y.length; x++) {
						if (y[x].func.apply(y[x].scope, v) === false) {
							return false
						}
					}
				}
				return true
			},
			bind : function(v, x, w) {
				var y;
				v = v.toLowerCase();
				y = p[v] || [];
				y.push({
					func : x,
					scope : w || this
				});
				p[v] = y
			},
			unbind : function(v) {
				v = v.toLowerCase();
				var y = p[v], w, x = arguments[1];
				if (y) {
					if (x !== b) {
						for (w = y.length - 1; w >= 0; w--) {
							if (y[w].func === x) {
								y.splice(w, 1);
								break
							}
						}
					} else {
						y = []
					}
					if (!y.length) {
						delete p[v]
					}
				}
			},
			unbindAll : function() {
				var v = this;
				g.each(p, function(x, w) {
					v.unbind(w)
				})
			},
			destroy : function() {
				this.trigger("Destroy");
				this.unbindAll()
			}
		})
	};
	g.File = function(r, p, q) {
		var o = this;
		o.id = r;
		o.name = p;
		o.size = q;
		o.loaded = 0;
		o.percent = 0;
		o.status = 0
	};
	g.Runtime = function() {
		this.getFeatures = function() {
		};
		this.init = function(o, p) {
		}
	};
	g.QueueProgress = function() {
		var o = this;
		o.size = 0;
		o.loaded = 0;
		o.uploaded = 0;
		o.failed = 0;
		o.queued = 0;
		o.percent = 0;
		o.bytesPerSec = 0;
		o.reset = function() {
			o.size = o.loaded = o.uploaded = o.failed = o.queued = o.percent = o.bytesPerSec = 0
		}
	};
	g.runtimes = {};
	window.plupload = g
})();
(function() {
	if (window.google && google.gears) {
		return
	}
	var a = null;
	if (typeof GearsFactory != "undefined") {
		a = new GearsFactory()
	} else {
		try {
			a = new ActiveXObject("Gears.Factory");
			if (a.getBuildInfo().indexOf("ie_mobile") != -1) {
				a.privateSetGlobalObject(this)
			}
		} catch (b) {
			if ((typeof navigator.mimeTypes != "undefined")
					&& navigator.mimeTypes["application/x-googlegears"]) {
				a = document.createElement("object");
				a.style.display = "none";
				a.width = 0;
				a.height = 0;
				a.type = "application/x-googlegears";
				document.documentElement.appendChild(a)
			}
		}
	}
	if (!a) {
		return
	}
	if (!window.google) {
		window.google = {}
	}
	if (!google.gears) {
		google.gears = {
			factory : a
		}
	}
})();
(function(e, b, c, d) {
	var f = {};
	function a(h, k, m) {
		var g, j, l, o;
		j = google.gears.factory.create("beta.canvas");
		try {
			j.decode(h);
			if (!k.width) {
				k.width = j.width
			}
			if (!k.height) {
				k.height = j.height
			}
			o = Math.min(width / j.width, height / j.height);
			if (o < 1 || (o === 1 && m === "image/jpeg")) {
				j.resize(Math.round(j.width * o), Math.round(j.height * o));
				if (k.quality) {
					return j.encode(m, {
						quality : k.quality / 100
					})
				}
				return j.encode(m)
			}
		} catch (n) {
		}
		return h
	}
	c.runtimes.Gears = c
			.addRuntime(
					"gears",
					{
						getFeatures : function() {
							return {
								dragdrop : true,
								jpgresize : true,
								pngresize : true,
								chunks : true,
								progress : true,
								multipart : true
							}
						},
						init : function(j, l) {
							var k;
							if (!e.google || !google.gears) {
								return l({
									success : false
								})
							}
							try {
								k = google.gears.factory.create("beta.desktop")
							} catch (h) {
								return l({
									success : false
								})
							}
							function g(o) {
								var n, m, p = [], q;
								for (m = 0; m < o.length; m++) {
									n = o[m];
									q = c.guid();
									f[q] = n.blob;
									p
											.push(new c.File(q, n.name,
													n.blob.length))
								}
								j.trigger("FilesAdded", p)
							}
							j
									.bind(
											"PostInit",
											function() {
												var n = j.settings, m = b
														.getElementById(n.drop_element);
												if (m) {
													c
															.addEvent(
																	m,
																	"dragover",
																	function(o) {
																		k
																				.setDropEffect(
																						o,
																						"copy");
																		o
																				.preventDefault()
																	}, j.id);
													c
															.addEvent(
																	m,
																	"drop",
																	function(p) {
																		var o = k
																				.getDragData(
																						p,
																						"application/x-gears-files");
																		if (o) {
																			g(o.files)
																		}
																		p
																				.preventDefault()
																	}, j.id);
													m = 0
												}
												c
														.addEvent(
																b
																		.getElementById(n.browse_button),
																"click",
																function(s) {
																	var r = [], p, o, q;
																	s
																			.preventDefault();
																	for (p = 0; p < n.filters.length; p++) {
																		q = n.filters[p].extensions
																				.split(",");
																		for (o = 0; o < q.length; o++) {
																			r
																					.push("."
																							+ q[o])
																		}
																	}
																	k
																			.openFiles(
																					g,
																					{
																						singleFile : !n.multi_selection,
																						filter : r
																					})
																}, j.id)
											});
							j
									.bind(
											"UploadFile",
											function(s, p) {
												var u = 0, t, q, r = 0, o = s.settings.resize, m;
												if (o
														&& /\.(png|jpg|jpeg)$/i
																.test(p.name)) {
													f[p.id] = a(
															f[p.id],
															o,
															/\.png$/i
																	.test(p.name) ? "image/png"
																	: "image/jpeg")
												}
												p.size = f[p.id].length;
												q = s.settings.chunk_size;
												m = q > 0;
												t = Math.ceil(p.size / q);
												if (!m) {
													q = p.size;
													t = 1
												}
												function n() {
													var z, B, w = s.settings.multipart, v = 0, A = {
														name : p.target_name
																|| p.name
													}, x = s.settings.url;
													function y(D) {
														var C, I = "----pluploadboundary"
																+ c.guid(), F = "--", H = "\r\n", E, G;
														if (w) {
															z
																	.setRequestHeader(
																			"Content-Type",
																			"multipart/form-data; boundary="
																					+ I);
															C = google.gears.factory
																	.create("beta.blobbuilder");
															c
																	.each(
																			c
																					.extend(
																							A,
																							s.settings.multipart_params),
																			function(
																					K,
																					J) {
																				C
																						.append(F
																								+ I
																								+ H
																								+ 'Content-Disposition: form-data; name="'
																								+ J
																								+ '"'
																								+ H
																								+ H);
																				C
																						.append(K
																								+ H)
																			});
															G = c.mimeTypes[p.name
																	.replace(
																			/^.+\.([^.]+)/,
																			"$1")
																	.toLowerCase()]
																	|| "application/octet-stream";
															C
																	.append(F
																			+ I
																			+ H
																			+ 'Content-Disposition: form-data; name="'
																			+ s.settings.file_data_name
																			+ '"; filename="'
																			+ p.name
																			+ '"'
																			+ H
																			+ "Content-Type: "
																			+ G
																			+ H
																			+ H);
															C.append(D);
															C.append(H + F + I
																	+ F + H);
															E = C.getAsBlob();
															v = E.length
																	- D.length;
															D = E
														}
														z.send(D)
													}
													if (p.status == c.DONE
															|| p.status == c.FAILED
															|| s.state == c.STOPPED) {
														return
													}
													if (m) {
														A.chunk = u;
														A.chunks = t
													}
													B = Math.min(q, p.size
															- (u * q));
													if (!w) {
														x = c.buildUrl(
																s.settings.url,
																A)
													}
													z = google.gears.factory
															.create("beta.httprequest");
													z.open("POST", x);
													if (!w) {
														z
																.setRequestHeader(
																		"Content-Disposition",
																		'attachment; filename="'
																				+ p.name
																				+ '"');
														z
																.setRequestHeader(
																		"Content-Type",
																		"application/octet-stream")
													}
													c
															.each(
																	s.settings.headers,
																	function(D,
																			C) {
																		z
																				.setRequestHeader(
																						C,
																						D)
																	});
													z.upload.onprogress = function(
															C) {
														p.loaded = r + C.loaded
																- v;
														s
																.trigger(
																		"UploadProgress",
																		p)
													};
													z.onreadystatechange = function() {
														var C;
														if (z.readyState == 4) {
															if (z.status == 200) {
																C = {
																	chunk : u,
																	chunks : t,
																	response : z.responseText,
																	status : z.status
																};
																s
																		.trigger(
																				"ChunkUploaded",
																				p,
																				C);
																if (C.cancelled) {
																	p.status = c.FAILED;
																	return
																}
																r += B;
																if (++u >= t) {
																	p.status = c.DONE;
																	s
																			.trigger(
																					"FileUploaded",
																					p,
																					{
																						response : z.responseText,
																						status : z.status
																					})
																} else {
																	n()
																}
															} else {
																s
																		.trigger(
																				"Error",
																				{
																					code : c.HTTP_ERROR,
																					message : c
																							.translate("HTTP Error."),
																					file : p,
																					chunk : u,
																					chunks : t,
																					status : z.status
																				})
															}
														}
													};
													if (u < t) {
														y(f[p.id].slice(u * q,
																B))
													}
												}
												n()
											});
							j.bind("Destroy", function(m) {
								var n, o, p = {
									browseButton : m.settings.browse_button,
									dropElm : m.settings.drop_element
								};
								for (n in p) {
									o = b.getElementById(p[n]);
									if (o) {
										c.removeAllEvents(o, m.id)
									}
								}
							});
							l({
								success : true
							})
						}
					})
})(window, document, plupload);
(function(g, b, d, e) {
	var a = {}, h = {};
	function c(o) {
		var n, m = typeof o, j, l, k;
		if (m === "string") {
			n = "\bb\tt\nn\ff\rr\"\"''\\\\";
			return '"'
					+ o.replace(/([\u0080-\uFFFF\x00-\x1f\"])/g,
							function(r, q) {
								var p = n.indexOf(q);
								if (p + 1) {
									return "\\" + n.charAt(p + 1)
								}
								r = q.charCodeAt().toString(16);
								return "\\u" + "0000".substring(r.length) + r
							}) + '"'
		}
		if (m == "object") {
			j = o.length !== e;
			n = "";
			if (j) {
				for (l = 0; l < o.length; l++) {
					if (n) {
						n += ","
					}
					n += c(o[l])
				}
				n = "[" + n + "]"
			} else {
				for (k in o) {
					if (o.hasOwnProperty(k)) {
						if (n) {
							n += ","
						}
						n += c(k) + ":" + c(o[k])
					}
				}
				n = "{" + n + "}"
			}
			return n
		}
		if (o === e) {
			return "null"
		}
		return "" + o
	}
	function f(s) {
		var v = false, j = null, o = null, k, l, m, u, n, q = 0;
		try {
			try {
				o = new ActiveXObject("AgControl.AgControl");
				if (o.IsVersionSupported(s)) {
					v = true
				}
				o = null
			} catch (r) {
				var p = navigator.plugins["Silverlight Plug-In"];
				if (p) {
					k = p.description;
					if (k === "1.0.30226.2") {
						k = "2.0.30226.2"
					}
					l = k.split(".");
					while (l.length > 3) {
						l.pop()
					}
					while (l.length < 4) {
						l.push(0)
					}
					m = s.split(".");
					while (m.length > 4) {
						m.pop()
					}
					do {
						u = parseInt(m[q], 10);
						n = parseInt(l[q], 10);
						q++
					} while (q < m.length && u === n);
					if (u <= n && !isNaN(u)) {
						v = true
					}
				}
			}
		} catch (t) {
			v = false
		}
		return v
	}
	d.silverlight = {
		trigger : function(n, k) {
			var m = a[n], l, j;
			if (m) {
				j = d.toArray(arguments).slice(1);
				j[0] = "Silverlight:" + k;
				setTimeout(function() {
					m.trigger.apply(m, j)
				}, 0)
			}
		}
	};
	d.runtimes.Silverlight = d
			.addRuntime(
					"silverlight",
					{
						getFeatures : function() {
							return {
								jpgresize : true,
								pngresize : true,
								chunks : true,
								progress : true,
								multipart : true
							}
						},
						init : function(p, q) {
							var o, m = "", n = p.settings.filters, l, k = b.body;
							if (!f("2.0.31005.0")
									|| (g.opera && g.opera.buildNumber)) {
								q({
									success : false
								});
								return
							}
							h[p.id] = false;
							a[p.id] = p;
							o = b.createElement("div");
							o.id = p.id + "_silverlight_container";
							d.extend(o.style, {
								position : "absolute",
								top : "0px",
								background : p.settings.shim_bgcolor
										|| "transparent",
								zIndex : 99999,
								width : "100px",
								height : "100px",
								overflow : "hidden",
								opacity : p.settings.shim_bgcolor
										|| b.documentMode > 8 ? "" : 0.01
							});
							o.className = "plupload silverlight";
							if (p.settings.container) {
								k = b.getElementById(p.settings.container);
								if (d.getStyle(k, "position") === "static") {
									k.style.position = "relative"
								}
							}
							k.appendChild(o);
							for (l = 0; l < n.length; l++) {
								m += (m != "" ? "|" : "") + n[l].title
										+ " | *."
										+ n[l].extensions.replace(/,/g, ";*.")
							}
							o.innerHTML = '<object id="'
									+ p.id
									+ '_silverlight" data="data:application/x-silverlight," type="application/x-silverlight-2" style="outline:none;" width="1024" height="1024"><param name="source" value="'
									+ p.settings.silverlight_xap_url
									+ '"/><param name="background" value="Transparent"/><param name="windowless" value="true"/><param name="enablehtmlaccess" value="true"/><param name="initParams" value="id='
									+ p.id + ",filter=" + m + ",multiselect="
									+ p.settings.multi_selection
									+ '"/></object>';
							function j() {
								return b.getElementById(p.id + "_silverlight").content.Upload
							}
							p
									.bind(
											"Silverlight:Init",
											function() {
												var r, s = {};
												if (h[p.id]) {
													return
												}
												h[p.id] = true;
												p
														.bind(
																"Silverlight:StartSelectFiles",
																function(t) {
																	r = []
																});
												p
														.bind(
																"Silverlight:SelectFile",
																function(t, w,
																		u, v) {
																	var x;
																	x = d
																			.guid();
																	s[x] = w;
																	s[w] = x;
																	r
																			.push(new d.File(
																					x,
																					u,
																					v))
																});
												p
														.bind(
																"Silverlight:SelectSuccessful",
																function() {
																	if (r.length) {
																		p
																				.trigger(
																						"FilesAdded",
																						r)
																	}
																});
												p
														.bind(
																"Silverlight:UploadChunkError",
																function(t, w,
																		u, x, v) {
																	p
																			.trigger(
																					"Error",
																					{
																						code : d.IO_ERROR,
																						message : "IO Error.",
																						details : v,
																						file : t
																								.getFile(s[w])
																					})
																});
												p
														.bind(
																"Silverlight:UploadFileProgress",
																function(t, x,
																		u, w) {
																	var v = t
																			.getFile(s[x]);
																	if (v.status != d.FAILED) {
																		v.size = w;
																		v.loaded = u;
																		t
																				.trigger(
																						"UploadProgress",
																						v)
																	}
																});
												p
														.bind(
																"Refresh",
																function(t) {
																	var u, v, w;
																	u = b
																			.getElementById(t.settings.browse_button);
																	if (u) {
																		v = d
																				.getPos(
																						u,
																						b
																								.getElementById(t.settings.container));
																		w = d
																				.getSize(u);
																		d
																				.extend(
																						b
																								.getElementById(t.id
																										+ "_silverlight_container").style,
																						{
																							top : v.y
																									+ "px",
																							left : v.x
																									+ "px",
																							width : w.w
																									+ "px",
																							height : w.h
																									+ "px"
																						})
																	}
																});
												p
														.bind(
																"Silverlight:UploadChunkSuccessful",
																function(t, w,
																		u, z, y) {
																	var x, v = t
																			.getFile(s[w]);
																	x = {
																		chunk : u,
																		chunks : z,
																		response : y
																	};
																	t
																			.trigger(
																					"ChunkUploaded",
																					v,
																					x);
																	if (v.status != d.FAILED) {
																		j()
																				.UploadNextChunk()
																	}
																	if (u == z - 1) {
																		v.status = d.DONE;
																		t
																				.trigger(
																						"FileUploaded",
																						v,
																						{
																							response : y
																						})
																	}
																});
												p
														.bind(
																"Silverlight:UploadSuccessful",
																function(t, w,
																		u) {
																	var v = t
																			.getFile(s[w]);
																	v.status = d.DONE;
																	t
																			.trigger(
																					"FileUploaded",
																					v,
																					{
																						response : u
																					})
																});
												p
														.bind(
																"FilesRemoved",
																function(t, v) {
																	var u;
																	for (u = 0; u < v.length; u++) {
																		j()
																				.RemoveFile(
																						s[v[u].id])
																	}
																});
												p
														.bind(
																"UploadFile",
																function(t, v) {
																	var w = t.settings, u = w.resize
																			|| {};
																	j()
																			.UploadFile(
																					s[v.id],
																					t.settings.url,
																					c({
																						name : v.target_name
																								|| v.name,
																						mime : d.mimeTypes[v.name
																								.replace(
																										/^.+\.([^.]+)/,
																										"$1")
																								.toLowerCase()]
																								|| "application/octet-stream",
																						chunk_size : w.chunk_size,
																						image_width : u.width,
																						image_height : u.height,
																						image_quality : u.quality || 90,
																						multipart : !!w.multipart,
																						multipart_params : w.multipart_params
																								|| {},
																						file_data_name : w.file_data_name,
																						headers : w.headers
																					}))
																});
												p
														.bind(
																"Silverlight:MouseEnter",
																function(t) {
																	var u, v;
																	u = b
																			.getElementById(p.settings.browse_button);
																	v = t.settings.browse_button_hover;
																	if (u && v) {
																		d
																				.addClass(
																						u,
																						v)
																	}
																});
												p
														.bind(
																"Silverlight:MouseLeave",
																function(t) {
																	var u, v;
																	u = b
																			.getElementById(p.settings.browse_button);
																	v = t.settings.browse_button_hover;
																	if (u && v) {
																		d
																				.removeClass(
																						u,
																						v)
																	}
																});
												p
														.bind(
																"Silverlight:MouseLeftButtonDown",
																function(t) {
																	var u, v;
																	u = b
																			.getElementById(p.settings.browse_button);
																	v = t.settings.browse_button_active;
																	if (u && v) {
																		d
																				.addClass(
																						u,
																						v);
																		d
																				.addEvent(
																						b.body,
																						"mouseup",
																						function() {
																							d
																									.removeClass(
																											u,
																											v)
																						})
																	}
																});
												p
														.bind(
																"Sliverlight:StartSelectFiles",
																function(t) {
																	var u, v;
																	u = b
																			.getElementById(p.settings.browse_button);
																	v = t.settings.browse_button_active;
																	if (u && v) {
																		d
																				.removeClass(
																						u,
																						v)
																	}
																});
												p
														.bind(
																"Destroy",
																function(t) {
																	var u;
																	d
																			.removeAllEvents(
																					b.body,
																					t.id);
																	delete h[t.id];
																	delete a[t.id];
																	u = b
																			.getElementById(t.id
																					+ "_silverlight_container");
																	if (u) {
																		k
																				.removeChild(u)
																	}
																});
												q({
													success : true
												})
											})
						}
					})
})(window, document, plupload);
(function(f, b, d, e) {
	var a = {}, g = {};
	function c() {
		var h;
		try {
			h = navigator.plugins["Shockwave Flash"];
			h = h.description
		} catch (k) {
			try {
				h = new ActiveXObject("ShockwaveFlash.ShockwaveFlash")
						.GetVariable("$version")
			} catch (j) {
				h = "0.0"
			}
		}
		h = h.match(/\d+/g);
		return parseFloat(h[0] + "." + h[1])
	}
	d.flash = {
		trigger : function(k, h, j) {
			setTimeout(function() {
				var n = a[k], m, l;
				if (n) {
					n.trigger("Flash:" + h, j)
				}
			}, 0)
		}
	};
	d.runtimes.Flash = d
			.addRuntime(
					"flash",
					{
						getFeatures : function() {
							return {
								jpgresize : true,
								pngresize : true,
								maxWidth : 8091,
								maxHeight : 8091,
								chunks : true,
								progress : true,
								multipart : true
							}
						},
						init : function(k, p) {
							var o, j, l, q = 0, h = b.body;
							if (c() < 10) {
								p({
									success : false
								});
								return
							}
							g[k.id] = false;
							a[k.id] = k;
							o = b.getElementById(k.settings.browse_button);
							j = b.createElement("div");
							j.id = k.id + "_flash_container";
							d.extend(j.style, {
								position : "absolute",
								top : "0px",
								background : k.settings.shim_bgcolor
										|| "transparent",
								zIndex : 99999,
								width : "100%",
								height : "100%"
							});
							j.className = "plupload flash";
							if (k.settings.container) {
								h = b.getElementById(k.settings.container);
								if (d.getStyle(h, "position") === "static") {
									h.style.position = "relative"
								}
							}
							h.appendChild(j);
							l = "id=" + escape(k.id);
							j.innerHTML = '<object id="'
									+ k.id
									+ '_flash" width="100%" height="100%" style="outline:0" type="application/x-shockwave-flash" data="'
									+ k.settings.flash_swf_url
									+ '"><param name="movie" value="'
									+ k.settings.flash_swf_url
									+ '" /><param name="flashvars" value="'
									+ l
									+ '" /><param name="wmode" value="transparent" /><param name="allowscriptaccess" value="always" /></object>';
							function n() {
								return b.getElementById(k.id + "_flash")
							}
							function m() {
								if (q++ > 5000) {
									p({
										success : false
									});
									return
								}
								if (!g[k.id]) {
									setTimeout(m, 1)
								}
							}
							m();
							o = j = null;
							k
									.bind(
											"Flash:Init",
											function() {
												var s = {}, r;
												n()
														.setFileFilters(
																k.settings.filters,
																k.settings.multi_selection);
												if (g[k.id]) {
													return
												}
												g[k.id] = true;
												k
														.bind(
																"UploadFile",
																function(t, v) {
																	var w = t.settings, u = k.settings.resize
																			|| {};
																	n()
																			.uploadFile(
																					s[v.id],
																					w.url,
																					{
																						name : v.target_name
																								|| v.name,
																						mime : d.mimeTypes[v.name
																								.replace(
																										/^.+\.([^.]+)/,
																										"$1")
																								.toLowerCase()]
																								|| "application/octet-stream",
																						chunk_size : w.chunk_size,
																						width : u.width,
																						height : u.height,
																						quality : u.quality,
																						multipart : w.multipart,
																						multipart_params : w.multipart_params
																								|| {},
																						file_data_name : w.file_data_name,
																						format : /\.(jpg|jpeg)$/i
																								.test(v.name) ? "jpg"
																								: "png",
																						headers : w.headers,
																						urlstream_upload : w.urlstream_upload
																					})
																});
												k
														.bind(
																"Flash:UploadProcess",
																function(u, t) {
																	var v = u
																			.getFile(s[t.id]);
																	if (v.status != d.FAILED) {
																		v.loaded = t.loaded;
																		v.size = t.size;
																		u
																				.trigger(
																						"UploadProgress",
																						v)
																	}
																});
												k
														.bind(
																"Flash:UploadChunkComplete",
																function(t, v) {
																	var w, u = t
																			.getFile(s[v.id]);
																	w = {
																		chunk : v.chunk,
																		chunks : v.chunks,
																		response : v.text
																	};
																	t
																			.trigger(
																					"ChunkUploaded",
																					u,
																					w);
																	if (u.status != d.FAILED) {
																		n()
																				.uploadNextChunk()
																	}
																	if (v.chunk == v.chunks - 1) {
																		u.status = d.DONE;
																		t
																				.trigger(
																						"FileUploaded",
																						u,
																						{
																							response : v.text
																						})
																	}
																});
												k
														.bind(
																"Flash:SelectFiles",
																function(t, w) {
																	var v, u, x = [], y;
																	for (u = 0; u < w.length; u++) {
																		v = w[u];
																		y = d
																				.guid();
																		s[y] = v.id;
																		s[v.id] = y;
																		x
																				.push(new d.File(
																						y,
																						v.name,
																						v.size))
																	}
																	if (x.length) {
																		k
																				.trigger(
																						"FilesAdded",
																						x)
																	}
																});
												k
														.bind(
																"Flash:SecurityError",
																function(t, u) {
																	k
																			.trigger(
																					"Error",
																					{
																						code : d.SECURITY_ERROR,
																						message : d
																								.translate("Security error."),
																						details : u.message,
																						file : k
																								.getFile(s[u.id])
																					})
																});
												k
														.bind(
																"Flash:GenericError",
																function(t, u) {
																	k
																			.trigger(
																					"Error",
																					{
																						code : d.GENERIC_ERROR,
																						message : d
																								.translate("Generic error."),
																						details : u.message,
																						file : k
																								.getFile(s[u.id])
																					})
																});
												k
														.bind(
																"Flash:IOError",
																function(t, u) {
																	k
																			.trigger(
																					"Error",
																					{
																						code : d.IO_ERROR,
																						message : d
																								.translate("IO error."),
																						details : u.message,
																						file : k
																								.getFile(s[u.id])
																					})
																});
												k
														.bind(
																"Flash:ImageError",
																function(t, u) {
																	k
																			.trigger(
																					"Error",
																					{
																						code : parseInt(
																								u.code,
																								10),
																						message : d
																								.translate("Image error."),
																						file : k
																								.getFile(s[u.id])
																					})
																});
												k
														.bind(
																"Flash:StageEvent:rollOver",
																function(t) {
																	var u, v;
																	u = b
																			.getElementById(k.settings.browse_button);
																	v = t.settings.browse_button_hover;
																	if (u && v) {
																		d
																				.addClass(
																						u,
																						v)
																	}
																});
												k
														.bind(
																"Flash:StageEvent:rollOut",
																function(t) {
																	var u, v;
																	u = b
																			.getElementById(k.settings.browse_button);
																	v = t.settings.browse_button_hover;
																	if (u && v) {
																		d
																				.removeClass(
																						u,
																						v)
																	}
																});
												k
														.bind(
																"Flash:StageEvent:mouseDown",
																function(t) {
																	var u, v;
																	u = b
																			.getElementById(k.settings.browse_button);
																	v = t.settings.browse_button_active;
																	if (u && v) {
																		d
																				.addClass(
																						u,
																						v);
																		d
																				.addEvent(
																						b.body,
																						"mouseup",
																						function() {
																							d
																									.removeClass(
																											u,
																											v)
																						},
																						t.id)
																	}
																});
												k
														.bind(
																"Flash:StageEvent:mouseUp",
																function(t) {
																	var u, v;
																	u = b
																			.getElementById(k.settings.browse_button);
																	v = t.settings.browse_button_active;
																	if (u && v) {
																		d
																				.removeClass(
																						u,
																						v)
																	}
																});
												k.bind("QueueChanged",
														function(t) {
															k.refresh()
														});
												k
														.bind(
																"FilesRemoved",
																function(t, v) {
																	var u;
																	for (u = 0; u < v.length; u++) {
																		n()
																				.removeFile(
																						s[v[u].id])
																	}
																});
												k.bind("StateChanged",
														function(t) {
															k.refresh()
														});
												k
														.bind(
																"Refresh",
																function(t) {
																	var u, v, w;
																	n()
																			.setFileFilters(
																					k.settings.filters,
																					k.settings.multi_selection);
																	u = b
																			.getElementById(t.settings.browse_button);
																	if (u) {
																		v = d
																				.getPos(
																						u,
																						b
																								.getElementById(t.settings.container));
																		w = d
																				.getSize(u);
																		d
																				.extend(
																						b
																								.getElementById(t.id
																										+ "_flash_container").style,
																						{
																							top : v.y
																									+ "px",
																							left : v.x
																									+ "px",
																							width : w.w
																									+ "px",
																							height : w.h
																									+ "px"
																						})
																	}
																});
												k
														.bind(
																"Destroy",
																function(t) {
																	var u;
																	d
																			.removeAllEvents(
																					b.body,
																					t.id);
																	delete g[t.id];
																	delete a[t.id];
																	u = b
																			.getElementById(t.id
																					+ "_flash_container");
																	if (u) {
																		h
																				.removeChild(u)
																	}
																});
												p({
													success : true
												})
											})
						}
					})
})(window, document, plupload);
(function(a) {
	a.runtimes.BrowserPlus = a
			.addRuntime(
					"browserplus",
					{
						getFeatures : function() {
							return {
								dragdrop : true,
								jpgresize : true,
								pngresize : true,
								chunks : true,
								progress : true,
								multipart : true
							}
						},
						init : function(g, j) {
							var e = window.BrowserPlus, h = {}, d = g.settings, c = d.resize;
							function f(o) {
								var n, m, k = [], l, p;
								for (m = 0; m < o.length; m++) {
									l = o[m];
									p = a.guid();
									h[p] = l;
									k.push(new a.File(p, l.name, l.size))
								}
								if (m) {
									g.trigger("FilesAdded", k)
								}
							}
							function b() {
								g
										.bind(
												"PostInit",
												function() {
													var n, l = d.drop_element, p = g.id
															+ "_droptarget", k = document
															.getElementById(l), m;
													function q(s, r) {
														e.DragAndDrop
																.AddDropTarget(
																		{
																			id : s
																		},
																		function(
																				t) {
																			e.DragAndDrop
																					.AttachCallbacks(
																							{
																								id : s,
																								hover : function(
																										u) {
																									if (!u
																											&& r) {
																										r()
																									}
																								},
																								drop : function(
																										u) {
																									if (r) {
																										r()
																									}
																									f(u)
																								}
																							},
																							function() {
																							})
																		})
													}
													function o() {
														document
																.getElementById(p).style.top = "-1000px"
													}
													if (k) {
														if (document.attachEvent
																&& (/MSIE/gi)
																		.test(navigator.userAgent)) {
															n = document
																	.createElement("div");
															n.setAttribute(
																	"id", p);
															a
																	.extend(
																			n.style,
																			{
																				position : "absolute",
																				top : "-1000px",
																				background : "red",
																				filter : "alpha(opacity=0)",
																				opacity : 0
																			});
															document.body
																	.appendChild(n);
															a
																	.addEvent(
																			k,
																			"dragenter",
																			function(
																					s) {
																				var r, t;
																				r = document
																						.getElementById(l);
																				t = a
																						.getPos(r);
																				a
																						.extend(
																								document
																										.getElementById(p).style,
																								{
																									top : t.y
																											+ "px",
																									left : t.x
																											+ "px",
																									width : r.offsetWidth
																											+ "px",
																									height : r.offsetHeight
																											+ "px"
																								})
																			});
															q(p, o)
														} else {
															q(l)
														}
													}
													a
															.addEvent(
																	document
																			.getElementById(d.browse_button),
																	"click",
																	function(w) {
																		var u = [], s, r, v = d.filters, t;
																		w
																				.preventDefault();
																		for (s = 0; s < v.length; s++) {
																			t = v[s].extensions
																					.split(",");
																			for (r = 0; r < t.length; r++) {
																				u
																						.push(a.mimeTypes[t[r]])
																			}
																		}
																		e.FileBrowse
																				.OpenBrowseDialog(
																						{
																							mimeTypes : u
																						},
																						function(
																								x) {
																							if (x.success) {
																								f(x.value)
																							}
																						})
																	});
													k = n = null
												});
								g
										.bind(
												"UploadFile",
												function(n, k) {
													var m = h[k.id], s = {}, l = n.settings.chunk_size, o, p = [];
													function r(t, v) {
														var u;
														if (k.status == a.FAILED) {
															return
														}
														s.name = k.target_name
																|| k.name;
														if (l) {
															s.chunk = "" + t;
															s.chunks = "" + v
														}
														u = p.shift();
														e.Uploader
																.upload(
																		{
																			url : n.settings.url,
																			files : {
																				file : u
																			},
																			cookies : document.cookies,
																			postvars : a
																					.extend(
																							s,
																							n.settings.multipart_params),
																			progressCallback : function(
																					y) {
																				var x, w = 0;
																				o[t] = parseInt(
																						y.filePercent
																								* u.size
																								/ 100,
																						10);
																				for (x = 0; x < o.length; x++) {
																					w += o[x]
																				}
																				k.loaded = w;
																				n
																						.trigger(
																								"UploadProgress",
																								k)
																			}
																		},
																		function(
																				x) {
																			var w, y;
																			if (x.success) {
																				w = x.value.statusCode;
																				if (l) {
																					n
																							.trigger(
																									"ChunkUploaded",
																									k,
																									{
																										chunk : t,
																										chunks : v,
																										response : x.value.body,
																										status : w
																									})
																				}
																				if (p.length > 0) {
																					r(
																							++t,
																							v)
																				} else {
																					k.status = a.DONE;
																					n
																							.trigger(
																									"FileUploaded",
																									k,
																									{
																										response : x.value.body,
																										status : w
																									});
																					if (w >= 400) {
																						n
																								.trigger(
																										"Error",
																										{
																											code : a.HTTP_ERROR,
																											message : a
																													.translate("HTTP Error."),
																											file : k,
																											status : w
																										})
																					}
																				}
																			} else {
																				n
																						.trigger(
																								"Error",
																								{
																									code : a.GENERIC_ERROR,
																									message : a
																											.translate("Generic Error."),
																									file : k,
																									details : x.error
																								})
																			}
																		})
													}
													function q(t) {
														k.size = t.size;
														if (l) {
															e.FileAccess
																	.chunk(
																			{
																				file : t,
																				chunkSize : l
																			},
																			function(
																					w) {
																				if (w.success) {
																					var x = w.value, u = x.length;
																					o = Array(u);
																					for ( var v = 0; v < u; v++) {
																						o[v] = 0;
																						p
																								.push(x[v])
																					}
																					r(
																							0,
																							u)
																				}
																			})
														} else {
															o = Array(1);
															p.push(t);
															r(0, 1)
														}
													}
													if (c
															&& /\.(png|jpg|jpeg)$/i
																	.test(k.name)) {
														BrowserPlus.ImageAlter
																.transform(
																		{
																			file : m,
																			quality : c.quality || 90,
																			actions : [ {
																				scale : {
																					maxwidth : c.width,
																					maxheight : c.height
																				}
																			} ]
																		},
																		function(
																				t) {
																			if (t.success) {
																				q(t.value.file)
																			}
																		})
													} else {
														q(m)
													}
												});
								j({
									success : true
								})
							}
							if (e) {
								e.init(function(l) {
									var k = [ {
										service : "Uploader",
										version : "3"
									}, {
										service : "DragAndDrop",
										version : "1"
									}, {
										service : "FileBrowse",
										version : "1"
									}, {
										service : "FileAccess",
										version : "2"
									} ];
									if (c) {
										k.push({
											service : "ImageAlter",
											version : "4"
										})
									}
									if (l.success) {
										e.require({
											services : k
										}, function(m) {
											if (m.success) {
												b()
											} else {
												j()
											}
										})
									} else {
										j()
									}
								})
							} else {
								j()
							}
						}
					})
})(plupload);
(function(g, j, h, d) {
	var f;
	if (g.Uint8Array && g.ArrayBuffer && !XMLHttpRequest.prototype.sendAsBinary) {
		XMLHttpRequest.prototype.sendAsBinary = function(o) {
			var m = new Uint8Array(o.length);
			for ( var n = 0; n < o.length; n++) {
				m[n] = (o.charCodeAt(n) & 255)
			}
			this.send(m.buffer)
		}
	}
	function l(n, o) {
		var m;
		if ("FileReader" in g) {
			m = new FileReader();
			m.readAsDataURL(n);
			m.onload = function() {
				o(m.result)
			}
		} else {
			return o(n.getAsDataURL())
		}
	}
	function k(n, o) {
		var m;
		if ("FileReader" in g) {
			m = new FileReader();
			m.readAsBinaryString(n);
			m.onload = function() {
				o(m.result)
			}
		} else {
			return o(n.getAsBinary())
		}
	}
	function c(q, o, r, t) {
		var n, p, m, s;
		l(q, function(u) {
			n = j.createElement("canvas");
			n.style.display = "none";
			j.body.appendChild(n);
			p = n.getContext("2d");
			m = new Image();
			m.onerror = m.onabort = function() {
				t({
					success : false
				})
			};
			m.onload = function() {
				var z, v, x, w, y;
				if (!o.width) {
					o.width = m.width
				}
				if (!o.height) {
					o.height = m.height
				}
				s = Math.min(o.width / m.width, o.height / m.height);
				if (s < 1 || (s === 1 && r === "image/jpeg")) {
					z = Math.round(m.width * s);
					v = Math.round(m.height * s);
					n.width = z;
					n.height = v;
					p.drawImage(m, 0, 0, z, v);
					if (r === "image/jpeg") {
						w = new e(atob(u.substring(u.indexOf("base64,") + 7)));
						if (w.headers && w.headers.length) {
							y = new a();
							if (y.init(w.get("exif")[0])) {
								y.setExif("PixelXDimension", z);
								y.setExif("PixelYDimension", v);
								w.set("exif", y.getBinary())
							}
						}
						if (o.quality) {
							try {
								u = n.toDataURL(r, o.quality / 100)
							} catch (A) {
								u = n.toDataURL(r)
							}
						}
					} else {
						u = n.toDataURL(r)
					}
					u = u.substring(u.indexOf("base64,") + 7);
					u = atob(u);
					if (w.headers && w.headers.length) {
						u = w.restore(u);
						w.purge()
					}
					n.parentNode.removeChild(n);
					t({
						success : true,
						data : u
					})
				} else {
					t({
						success : false
					})
				}
			};
			m.src = u
		})
	}
	h.runtimes.Html5 = h
			.addRuntime(
					"html5",
					{
						getFeatures : function() {
							var r, n, q, o, m, p = g;
							n = q = o = m = false;
							if (p.XMLHttpRequest) {
								r = new XMLHttpRequest();
								q = !!r.upload;
								n = !!(r.sendAsBinary || r.upload)
							}
							if (n) {
								o = !!(File
										&& (File.prototype.getAsDataURL || p.FileReader) && r.sendAsBinary);
								m = !!(File && File.prototype.slice)
							}
							f = navigator.userAgent.indexOf("Safari") > 0
									&& navigator.vendor.indexOf("Apple") !== -1;
							return {
								html5 : n,
								dragdrop : p.mozInnerScreenX !== d || m || f,
								jpgresize : o,
								pngresize : o,
								multipart : o || !!p.FileReader || !!p.FormData,
								progress : q,
								chunks : m || o,
								canOpenDialog : navigator.userAgent
										.indexOf("WebKit") !== -1
							}
						},
						init : function(p, q) {
							var m = {}, n;
							function o(v) {
								var t, s, u = [], w, r = {};
								for (s = 0; s < v.length; s++) {
									t = v[s];
									if (r[t.name]) {
										continue
									}
									r[t.name] = true;
									w = h.guid();
									m[w] = t;
									u.push(new h.File(w, t.fileName, t.fileSize
											|| t.size))
								}
								if (u.length) {
									p.trigger("FilesAdded", u)
								}
							}
							n = this.getFeatures();
							if (!n.html5) {
								q({
									success : false
								});
								return
							}
							p
									.bind(
											"Init",
											function(v) {
												var F, E, B = [], u, C, s = v.settings.filters, t, A, r = j.body, D;
												F = j.createElement("div");
												F.id = v.id
														+ "_html5_container";
												h
														.extend(
																F.style,
																{
																	position : "absolute",
																	background : p.settings.shim_bgcolor
																			|| "transparent",
																	width : "100px",
																	height : "100px",
																	overflow : "hidden",
																	zIndex : 99999,
																	opacity : p.settings.shim_bgcolor ? ""
																			: 0
																});
												F.className = "plupload html5";
												if (p.settings.container) {
													r = j
															.getElementById(p.settings.container);
													if (h.getStyle(r,
															"position") === "static") {
														r.style.position = "relative"
													}
												}
												r.appendChild(F);
												no_type_restriction: for (u = 0; u < s.length; u++) {
													t = s[u].extensions
															.split(/,/);
													for (C = 0; C < t.length; C++) {
														if (t[C] === "*") {
															B = [];
															break no_type_restriction
														}
														A = h.mimeTypes[t[C]];
														if (A) {
															B.push(A)
														}
													}
												}
												F.innerHTML = '<input id="'
														+ p.id
														+ '_html5" style="width:100%;height:100%;font-size:99px" type="file" accept="'
														+ B.join(",")
														+ '" '
														+ (p.settings.multi_selection ? 'multiple="multiple"'
																: "") + " />";
												D = j.getElementById(p.id
														+ "_html5");
												D.onchange = function() {
													o(this.files);
													this.value = ""
												};
												E = j
														.getElementById(v.settings.browse_button);
												if (E) {
													var x = v.settings.browse_button_hover, z = v.settings.browse_button_active, w = v.features.canOpenDialog ? E
															: F;
													if (x) {
														h.addEvent(w,
																"mouseover",
																function() {
																	h.addClass(
																			E,
																			x)
																}, v.id);
														h
																.addEvent(
																		w,
																		"mouseout",
																		function() {
																			h
																					.removeClass(
																							E,
																							x)
																		}, v.id)
													}
													if (z) {
														h.addEvent(w,
																"mousedown",
																function() {
																	h.addClass(
																			E,
																			z)
																}, v.id);
														h
																.addEvent(
																		j.body,
																		"mouseup",
																		function() {
																			h
																					.removeClass(
																							E,
																							z)
																		}, v.id)
													}
													if (v.features.canOpenDialog) {
														h
																.addEvent(
																		E,
																		"click",
																		function(
																				y) {
																			j
																					.getElementById(
																							v.id
																									+ "_html5")
																					.click();
																			y
																					.preventDefault()
																		}, v.id)
													}
												}
											});
							p
									.bind(
											"PostInit",
											function() {
												var r = j
														.getElementById(p.settings.drop_element);
												if (r) {
													if (f) {
														h
																.addEvent(
																		r,
																		"dragenter",
																		function(
																				v) {
																			var u, s, t;
																			u = j
																					.getElementById(p.id
																							+ "_drop");
																			if (!u) {
																				u = j
																						.createElement("input");
																				u
																						.setAttribute(
																								"type",
																								"file");
																				u
																						.setAttribute(
																								"id",
																								p.id
																										+ "_drop");
																				u
																						.setAttribute(
																								"multiple",
																								"multiple");
																				h
																						.addEvent(
																								u,
																								"change",
																								function() {
																									o(this.files);
																									h
																											.removeEvent(
																													u,
																													"change",
																													p.id);
																									u.parentNode
																											.removeChild(u)
																								},
																								p.id);
																				r
																						.appendChild(u)
																			}
																			s = h
																					.getPos(
																							r,
																							j
																									.getElementById(p.settings.container));
																			t = h
																					.getSize(r);
																			if (h
																					.getStyle(
																							r,
																							"position") === "static") {
																				h
																						.extend(
																								r.style,
																								{
																									position : "relative"
																								})
																			}
																			h
																					.extend(
																							u.style,
																							{
																								position : "absolute",
																								display : "block",
																								top : 0,
																								left : 0,
																								width : t.w
																										+ "px",
																								height : t.h
																										+ "px",
																								opacity : 0
																							})
																		}, p.id);
														return
													}
													h
															.addEvent(
																	r,
																	"dragover",
																	function(s) {
																		s
																				.preventDefault()
																	}, p.id);
													h
															.addEvent(
																	r,
																	"drop",
																	function(t) {
																		var s = t.dataTransfer;
																		if (s
																				&& s.files) {
																			o(s.files)
																		}
																		t
																				.preventDefault()
																	}, p.id)
												}
											});
							p
									.bind(
											"Refresh",
											function(r) {
												var s, u, v, w, t;
												s = j
														.getElementById(p.settings.browse_button);
												if (s) {
													u = h
															.getPos(
																	s,
																	j
																			.getElementById(r.settings.container));
													v = h.getSize(s);
													w = j
															.getElementById(p.id
																	+ "_html5_container");
													h.extend(w.style, {
														top : u.y + "px",
														left : u.x + "px",
														width : v.w + "px",
														height : v.h + "px"
													});
													if (p.features.canOpenDialog) {
														t = parseInt(
																s.parentNode.style.zIndex,
																10);
														if (isNaN(t)) {
															t = 0
														}
														h.extend(s.style, {
															zIndex : t
														});
														if (h.getStyle(s,
																"position") === "static") {
															h
																	.extend(
																			s.style,
																			{
																				position : "relative"
																			})
														}
														h.extend(w.style, {
															zIndex : t - 1
														})
													}
												}
											});
							p
									.bind(
											"UploadFile",
											function(r, t) {
												var u = r.settings, w, s;
												function v(x) {
													var A = 0, z = 0;
													function y() {
														var H = x, O, P, K, L, M = 0, D = "----pluploadboundary"
																+ h.guid(), G, I, E, F = "--", N = "\r\n", J = "", C, B = r.settings.url;
														if (t.status == h.DONE
																|| t.status == h.FAILED
																|| r.state == h.STOPPED) {
															return
														}
														L = {
															name : t.target_name
																	|| t.name
														};
														if (u.chunk_size
																&& n.chunks) {
															G = u.chunk_size;
															K = Math
																	.ceil(t.size
																			/ G);
															I = Math
																	.min(
																			G,
																			t.size
																					- (A * G));
															if (typeof (x) == "string") {
																H = x
																		.substring(
																				A
																						* G,
																				A
																						* G
																						+ I)
															} else {
																H = x.slice(A
																		* G, I)
															}
															L.chunk = A;
															L.chunks = K
														} else {
															I = t.size
														}
														O = new XMLHttpRequest();
														P = O.upload;
														if (P) {
															P.onprogress = function(
																	Q) {
																t.loaded = Math
																		.min(
																				t.size,
																				z
																						+ Q.loaded
																						- M);
																r
																		.trigger(
																				"UploadProgress",
																				t)
															}
														}
														if (!r.settings.multipart
																|| !n.multipart) {
															B = h
																	.buildUrl(
																			r.settings.url,
																			L)
														} else {
															L.name = t.target_name
																	|| t.name
														}
														O.open("post", B, true);
														O.onreadystatechange = function() {
															var Q, S;
															if (O.readyState == 4) {
																try {
																	Q = O.status
																} catch (R) {
																	Q = 0
																}
																if (Q >= 400) {
																	r
																			.trigger(
																					"Error",
																					{
																						code : h.HTTP_ERROR,
																						message : h
																								.translate("HTTP Error."),
																						file : t,
																						status : Q
																					})
																} else {
																	if (K) {
																		S = {
																			chunk : A,
																			chunks : K,
																			response : O.responseText,
																			status : Q
																		};
																		r
																				.trigger(
																						"ChunkUploaded",
																						t,
																						S);
																		z += I;
																		if (S.cancelled) {
																			t.status = h.FAILED;
																			return
																		}
																		t.loaded = Math
																				.min(
																						t.size,
																						(A + 1)
																								* G)
																	} else {
																		t.loaded = t.size
																	}
																	r
																			.trigger(
																					"UploadProgress",
																					t);
																	if (!K
																			|| ++A >= K) {
																		t.status = h.DONE;
																		r
																				.trigger(
																						"FileUploaded",
																						t,
																						{
																							response : O.responseText,
																							status : Q
																						});
																		w = x = m[t.id] = null
																	} else {
																		y()
																	}
																}
																O = H = E = J = null
															}
														};
														h
																.each(
																		r.settings.headers,
																		function(
																				R,
																				Q) {
																			O
																					.setRequestHeader(
																							Q,
																							R)
																		});
														if (r.settings.multipart
																&& n.multipart) {
															if (!O.sendAsBinary) {
																E = new FormData();
																h
																		.each(
																				h
																						.extend(
																								L,
																								r.settings.multipart_params),
																				function(
																						R,
																						Q) {
																					E
																							.append(
																									Q,
																									R)
																				});
																E
																		.append(
																				r.settings.file_data_name,
																				H);
																O.send(E);
																return
															}
															O
																	.setRequestHeader(
																			"Content-Type",
																			"multipart/form-data; boundary="
																					+ D);
															h
																	.each(
																			h
																					.extend(
																							L,
																							r.settings.multipart_params),
																			function(
																					R,
																					Q) {
																				J += F
																						+ D
																						+ N
																						+ 'Content-Disposition: form-data; name="'
																						+ Q
																						+ '"'
																						+ N
																						+ N;
																				J += unescape(encodeURIComponent(R))
																						+ N
																			});
															C = h.mimeTypes[t.name
																	.replace(
																			/^.+\.([^.]+)/,
																			"$1")
																	.toLowerCase()]
																	|| "application/octet-stream";
															J += F
																	+ D
																	+ N
																	+ 'Content-Disposition: form-data; name="'
																	+ r.settings.file_data_name
																	+ '"; filename="'
																	+ unescape(encodeURIComponent(t.name))
																	+ '"'
																	+ N
																	+ "Content-Type: "
																	+ C + N + N
																	+ H + N + F
																	+ D + F + N;
															M = J.length
																	- H.length;
															H = J
														} else {
															O
																	.setRequestHeader(
																			"Content-Type",
																			"application/octet-stream")
														}
														if (O.sendAsBinary) {
															O.sendAsBinary(H)
														} else {
															O.send(H)
														}
													}
													y()
												}
												w = m[t.id];
												s = r.settings.resize;
												if (n.jpgresize) {
													if (s
															&& /\.(png|jpg|jpeg)$/i
																	.test(t.name)) {
														c(
																w,
																s,
																/\.png$/i
																		.test(t.name) ? "image/png"
																		: "image/jpeg",
																function(x) {
																	if (x.success) {
																		t.size = x.data.length;
																		v(x.data)
																	} else {
																		k(w, v)
																	}
																})
													} else {
														k(w, v)
													}
												} else {
													v(w)
												}
											});
							p.bind("Destroy", function(r) {
								var t, u, s = j.body, v = {
									inputContainer : r.id + "_html5_container",
									inputFile : r.id + "_html5",
									browseButton : r.settings.browse_button,
									dropElm : r.settings.drop_element
								};
								for (t in v) {
									u = j.getElementById(v[t]);
									if (u) {
										h.removeAllEvents(u, r.id)
									}
								}
								h.removeAllEvents(j.body, r.id);
								if (r.settings.container) {
									s = j.getElementById(r.settings.container)
								}
								s.removeChild(j
										.getElementById(v.inputContainer))
							});
							q({
								success : true
							})
						}
					});
	function b() {
		var p = false, n;
		function q(s, u) {
			var r = p ? 0 : -8 * (u - 1), v = 0, t;
			for (t = 0; t < u; t++) {
				v |= (n.charCodeAt(s + t) << Math.abs(r + t * 8))
			}
			return v
		}
		function m(t, r, s) {
			var s = arguments.length === 3 ? s : n.length - r - 1;
			n = n.substr(0, r) + t + n.substr(s + r)
		}
		function o(s, t, v) {
			var w = "", r = p ? 0 : -8 * (v - 1), u;
			for (u = 0; u < v; u++) {
				w += String.fromCharCode((t >> Math.abs(r + u * 8)) & 255)
			}
			m(w, s, v)
		}
		return {
			II : function(r) {
				if (r === d) {
					return p
				} else {
					p = r
				}
			},
			init : function(r) {
				p = false;
				n = r
			},
			SEGMENT : function(r, t, s) {
				switch (arguments.length) {
				case 1:
					return n.substr(r, n.length - r - 1);
				case 2:
					return n.substr(r, t);
				case 3:
					m(s, r, t);
					break;
				default:
					return n
				}
			},
			BYTE : function(r) {
				return q(r, 1)
			},
			SHORT : function(r) {
				return q(r, 2)
			},
			LONG : function(r, s) {
				if (s === d) {
					return q(r, 4)
				} else {
					o(r, s, 4)
				}
			},
			SLONG : function(r) {
				var s = q(r, 4);
				return (s > 2147483647 ? s - 4294967296 : s)
			},
			STRING : function(r, s) {
				var t = "";
				for (s += r; r < s; r++) {
					t += String.fromCharCode(q(r, 1))
				}
				return t
			}
		}
	}
	function e(r) {
		var t = {
			65505 : {
				app : "EXIF",
				name : "APP1",
				signature : "Exif\0"
			},
			65506 : {
				app : "ICC",
				name : "APP2",
				signature : "ICC_PROFILE\0"
			},
			65517 : {
				app : "IPTC",
				name : "APP13",
				signature : "Photoshop 3.0\0"
			}
		}, s = [], q, m, o = d, p = 0, n;
		q = new b();
		q.init(r);
		if (q.SHORT(0) !== 65496) {
			return
		}
		m = 2;
		n = Math.min(1048576, r.length);
		while (m <= n) {
			o = q.SHORT(m);
			if (o >= 65488 && o <= 65495) {
				m += 2;
				continue
			}
			if (o === 65498 || o === 65497) {
				break
			}
			p = q.SHORT(m + 2) + 2;
			if (t[o]
					&& q.STRING(m + 4, t[o].signature.length) === t[o].signature) {
				s.push({
					hex : o,
					app : t[o].app.toUpperCase(),
					name : t[o].name.toUpperCase(),
					start : m,
					length : p,
					segment : q.SEGMENT(m, p)
				})
			}
			m += p
		}
		q.init(null);
		return {
			headers : s,
			restore : function(w) {
				q.init(w);
				if (q.SHORT(0) !== 65496) {
					return false
				}
				m = q.SHORT(2) == 65504 ? 4 + q.SHORT(4) : 2;
				for ( var v = 0, u = s.length; v < u; v++) {
					q.SEGMENT(m, 0, s[v].segment);
					m += s[v].length
				}
				return q.SEGMENT()
			},
			get : function(w) {
				var x = [];
				for ( var v = 0, u = s.length; v < u; v++) {
					if (s[v].app === w.toUpperCase()) {
						x.push(s[v].segment)
					}
				}
				return x
			},
			set : function(x, w) {
				var y = [];
				if (typeof (w) === "string") {
					y.push(w)
				} else {
					y = w
				}
				for ( var v = ii = 0, u = s.length; v < u; v++) {
					if (s[v].app === x.toUpperCase()) {
						s[v].segment = y[ii];
						s[v].length = y[ii].length;
						ii++
					}
					if (ii >= y.length) {
						break
					}
				}
			},
			purge : function() {
				s = [];
				q.init(null)
			}
		}
	}
	function a() {
		var p, m, n = {}, s;
		p = new b();
		m = {
			tiff : {
				274 : "Orientation",
				34665 : "ExifIFDPointer",
				34853 : "GPSInfoIFDPointer"
			},
			exif : {
				36864 : "ExifVersion",
				40961 : "ColorSpace",
				40962 : "PixelXDimension",
				40963 : "PixelYDimension",
				36867 : "DateTimeOriginal",
				33434 : "ExposureTime",
				33437 : "FNumber",
				34855 : "ISOSpeedRatings",
				37377 : "ShutterSpeedValue",
				37378 : "ApertureValue",
				37383 : "MeteringMode",
				37384 : "LightSource",
				37385 : "Flash",
				41986 : "ExposureMode",
				41987 : "WhiteBalance",
				41990 : "SceneCaptureType",
				41988 : "DigitalZoomRatio",
				41992 : "Contrast",
				41993 : "Saturation",
				41994 : "Sharpness"
			},
			gps : {
				0 : "GPSVersionID",
				1 : "GPSLatitudeRef",
				2 : "GPSLatitude",
				3 : "GPSLongitudeRef",
				4 : "GPSLongitude"
			}
		};
		s = {
			ColorSpace : {
				1 : "sRGB",
				0 : "Uncalibrated"
			},
			MeteringMode : {
				0 : "Unknown",
				1 : "Average",
				2 : "CenterWeightedAverage",
				3 : "Spot",
				4 : "MultiSpot",
				5 : "Pattern",
				6 : "Partial",
				255 : "Other"
			},
			LightSource : {
				1 : "Daylight",
				2 : "Fliorescent",
				3 : "Tungsten",
				4 : "Flash",
				9 : "Fine weather",
				10 : "Cloudy weather",
				11 : "Shade",
				12 : "Daylight fluorescent (D 5700 - 7100K)",
				13 : "Day white fluorescent (N 4600 -5400K)",
				14 : "Cool white fluorescent (W 3900 - 4500K)",
				15 : "White fluorescent (WW 3200 - 3700K)",
				17 : "Standard light A",
				18 : "Standard light B",
				19 : "Standard light C",
				20 : "D55",
				21 : "D65",
				22 : "D75",
				23 : "D50",
				24 : "ISO studio tungsten",
				255 : "Other"
			},
			Flash : {
				0 : "Flash did not fire.",
				1 : "Flash fired.",
				5 : "Strobe return light not detected.",
				7 : "Strobe return light detected.",
				9 : "Flash fired, compulsory flash mode",
				13 : "Flash fired, compulsory flash mode, return light not detected",
				15 : "Flash fired, compulsory flash mode, return light detected",
				16 : "Flash did not fire, compulsory flash mode",
				24 : "Flash did not fire, auto mode",
				25 : "Flash fired, auto mode",
				29 : "Flash fired, auto mode, return light not detected",
				31 : "Flash fired, auto mode, return light detected",
				32 : "No flash function",
				65 : "Flash fired, red-eye reduction mode",
				69 : "Flash fired, red-eye reduction mode, return light not detected",
				71 : "Flash fired, red-eye reduction mode, return light detected",
				73 : "Flash fired, compulsory flash mode, red-eye reduction mode",
				77 : "Flash fired, compulsory flash mode, red-eye reduction mode, return light not detected",
				79 : "Flash fired, compulsory flash mode, red-eye reduction mode, return light detected",
				89 : "Flash fired, auto mode, red-eye reduction mode",
				93 : "Flash fired, auto mode, return light not detected, red-eye reduction mode",
				95 : "Flash fired, auto mode, return light detected, red-eye reduction mode"
			},
			ExposureMode : {
				0 : "Auto exposure",
				1 : "Manual exposure",
				2 : "Auto bracket"
			},
			WhiteBalance : {
				0 : "Auto white balance",
				1 : "Manual white balance"
			},
			SceneCaptureType : {
				0 : "Standard",
				1 : "Landscape",
				2 : "Portrait",
				3 : "Night scene"
			},
			Contrast : {
				0 : "Normal",
				1 : "Soft",
				2 : "Hard"
			},
			Saturation : {
				0 : "Normal",
				1 : "Low saturation",
				2 : "High saturation"
			},
			Sharpness : {
				0 : "Normal",
				1 : "Soft",
				2 : "Hard"
			},
			GPSLatitudeRef : {
				N : "North latitude",
				S : "South latitude"
			},
			GPSLongitudeRef : {
				E : "East longitude",
				W : "West longitude"
			}
		};
		function o(t, B) {
			var v = p.SHORT(t), y, E, F, A, z, u, w, C, D = [], x = {};
			for (y = 0; y < v; y++) {
				w = u = t + 12 * y + 2;
				F = B[p.SHORT(w)];
				if (F === d) {
					continue
				}
				A = p.SHORT(w += 2);
				z = p.LONG(w += 2);
				w += 4;
				D = [];
				switch (A) {
				case 1:
				case 7:
					if (z > 4) {
						w = p.LONG(w) + n.tiffHeader
					}
					for (E = 0; E < z; E++) {
						D[E] = p.BYTE(w + E)
					}
					break;
				case 2:
					if (z > 4) {
						w = p.LONG(w) + n.tiffHeader
					}
					x[F] = p.STRING(w, z - 1);
					continue;
				case 3:
					if (z > 2) {
						w = p.LONG(w) + n.tiffHeader
					}
					for (E = 0; E < z; E++) {
						D[E] = p.SHORT(w + E * 2)
					}
					break;
				case 4:
					if (z > 1) {
						w = p.LONG(w) + n.tiffHeader
					}
					for (E = 0; E < z; E++) {
						D[E] = p.LONG(w + E * 4)
					}
					break;
				case 5:
					w = p.LONG(w) + n.tiffHeader;
					for (E = 0; E < z; E++) {
						D[E] = p.LONG(w + E * 4) / p.LONG(w + E * 4 + 4)
					}
					break;
				case 9:
					w = p.LONG(w) + n.tiffHeader;
					for (E = 0; E < z; E++) {
						D[E] = p.SLONG(w + E * 4)
					}
					break;
				case 10:
					w = p.LONG(w) + n.tiffHeader;
					for (E = 0; E < z; E++) {
						D[E] = p.SLONG(w + E * 4) / p.SLONG(w + E * 4 + 4)
					}
					break;
				default:
					continue
				}
				C = (z == 1 ? D[0] : D);
				if (s.hasOwnProperty(F) && typeof C != "object") {
					x[F] = s[F][C]
				} else {
					x[F] = C
				}
			}
			return x
		}
		function r() {
			var u = d, t = n.tiffHeader;
			p.II(p.SHORT(t) == 18761);
			if (p.SHORT(t += 2) !== 42) {
				return false
			}
			n.IFD0 = n.tiffHeader + p.LONG(t += 2);
			u = o(n.IFD0, m.tiff);
			n.exifIFD = ("ExifIFDPointer" in u ? n.tiffHeader
					+ u.ExifIFDPointer : d);
			n.gpsIFD = ("GPSInfoIFDPointer" in u ? n.tiffHeader
					+ u.GPSInfoIFDPointer : d);
			return true
		}
		function q(v, t, y) {
			var A, x, w, z = 0;
			if (typeof (t) === "string") {
				var u = m[v.toLowerCase()];
				for (hex in u) {
					if (u[hex] === t) {
						t = hex;
						break
					}
				}
			}
			A = n[v.toLowerCase() + "IFD"];
			x = p.SHORT(A);
			for (i = 0; i < x; i++) {
				w = A + 12 * i + 2;
				if (p.SHORT(w) == t) {
					z = w + 8;
					break
				}
			}
			if (!z) {
				return false
			}
			p.LONG(z, y);
			return true
		}
		return {
			init : function(t) {
				n = {
					tiffHeader : 10
				};
				if (t === d || !t.length) {
					return false
				}
				p.init(t);
				if (p.SHORT(0) === 65505
						&& p.STRING(4, 5).toUpperCase() === "EXIF\0") {
					return r()
				}
				return false
			},
			EXIF : function() {
				var t;
				t = o(n.exifIFD, m.exif);
				t.ExifVersion = String.fromCharCode(t.ExifVersion[0],
						t.ExifVersion[1], t.ExifVersion[2], t.ExifVersion[3]);
				return t
			},
			GPS : function() {
				var t;
				t = o(n.gpsIFD, m.gps);
				t.GPSVersionID = t.GPSVersionID.join(".");
				return t
			},
			setExif : function(t, u) {
				if (t !== "PixelXDimension" && t !== "PixelYDimension") {
					return false
				}
				return q("exif", t, u)
			},
			getBinary : function() {
				return p.SEGMENT()
			}
		}
	}
})(window, document, plupload);
(function(d, a, b, c) {
	function e(f) {
		return a.getElementById(f)
	}
	b.runtimes.Html4 = b
			.addRuntime(
					"html4",
					{
						getFeatures : function() {
							return {
								multipart : true,
								canOpenDialog : navigator.userAgent
										.indexOf("WebKit") !== -1
							}
						},
						init : function(f, g) {
							f
									.bind(
											"Init",
											function(p) {
												var j = a.body, n, h = "javascript", k, x, q, z = [], r = /MSIE/
														.test(navigator.userAgent), t = [], m = p.settings.filters, o, l, s, w;
												no_type_restriction: for (o = 0; o < m.length; o++) {
													l = m[o].extensions
															.split(/,/);
													for (w = 0; w < l.length; w++) {
														if (l[w] === "*") {
															t = [];
															break no_type_restriction
														}
														s = b.mimeTypes[l[w]];
														if (s) {
															t.push(s)
														}
													}
												}
												t = t.join(",");
												function v() {
													var C, A, y, B;
													q = b.guid();
													z.push(q);
													C = a.createElement("form");
													C.setAttribute("id",
															"form_" + q);
													C.setAttribute("method",
															"post");
													C
															.setAttribute(
																	"enctype",
																	"multipart/form-data");
													C
															.setAttribute(
																	"encoding",
																	"multipart/form-data");
													C.setAttribute("target",
															p.id + "_iframe");
													C.style.position = "absolute";
													A = a
															.createElement("input");
													A.setAttribute("id",
															"input_" + q);
													A.setAttribute("type",
															"file");
													A.setAttribute("accept", t);
													A.setAttribute("size", 1);
													B = e(p.settings.browse_button);
													if (p.features.canOpenDialog
															&& B) {
														b
																.addEvent(
																		e(p.settings.browse_button),
																		"click",
																		function(
																				D) {
																			A
																					.click();
																			D
																					.preventDefault()
																		}, p.id)
													}
													b.extend(A.style, {
														width : "100%",
														height : "100%",
														opacity : 0,
														fontSize : "99px"
													});
													b.extend(C.style, {
														overflow : "hidden"
													});
													y = p.settings.shim_bgcolor;
													if (y) {
														C.style.background = y
													}
													if (r) {
														b
																.extend(
																		A.style,
																		{
																			filter : "alpha(opacity=0)"
																		})
													}
													b
															.addEvent(
																	A,
																	"change",
																	function(G) {
																		var E = G.target, D, F = [], H;
																		if (E.value) {
																			e("form_"
																					+ q).style.top = -1048575
																					+ "px";
																			D = E.value
																					.replace(
																							/\\/g,
																							"/");
																			D = D
																					.substring(
																							D.length,
																							D
																									.lastIndexOf("/") + 1);
																			F
																					.push(new b.File(
																							q,
																							D));
																			if (!p.features.canOpenDialog) {
																				b
																						.removeAllEvents(
																								C,
																								p.id)
																			} else {
																				b
																						.removeEvent(
																								B,
																								"click",
																								p.id)
																			}
																			b
																					.removeEvent(
																							A,
																							"change",
																							p.id);
																			v();
																			if (F.length) {
																				f
																						.trigger(
																								"FilesAdded",
																								F)
																			}
																		}
																	}, p.id);
													C.appendChild(A);
													j.appendChild(C);
													p.refresh()
												}
												function u() {
													var y = a
															.createElement("div");
													y.innerHTML = '<iframe id="'
															+ p.id
															+ '_iframe" name="'
															+ p.id
															+ '_iframe" src="'
															+ h
															+ ':&quot;&quot;" style="display:none"></iframe>';
													n = y.firstChild;
													j.appendChild(n);
													b
															.addEvent(
																	n,
																	"load",
																	function(D) {
																		var E = D.target, C, A;
																		if (!k) {
																			return
																		}
																		try {
																			C = E.contentWindow.document
																					|| E.contentDocument
																					|| d.frames[E.id].document
																		} catch (B) {
																			p
																					.trigger(
																							"Error",
																							{
																								code : b.SECURITY_ERROR,
																								message : b
																										.translate("Security error."),
																								file : k
																							});
																			return
																		}
																		A = C.documentElement.innerText
																				|| C.documentElement.textContent;
																		if (A) {
																			k.status = b.DONE;
																			k.loaded = 1025;
																			k.percent = 100;
																			p
																					.trigger(
																							"UploadProgress",
																							k);
																			p
																					.trigger(
																							"FileUploaded",
																							k,
																							{
																								response : A
																							})
																		}
																	}, p.id)
												}
												if (p.settings.container) {
													j = e(p.settings.container);
													if (b.getStyle(j,
															"position") === "static") {
														j.style.position = "relative"
													}
												}
												p
														.bind(
																"UploadFile",
																function(y, B) {
																	var C, A;
																	if (B.status == b.DONE
																			|| B.status == b.FAILED
																			|| y.state == b.STOPPED) {
																		return
																	}
																	C = e("form_"
																			+ B.id);
																	A = e("input_"
																			+ B.id);
																	A
																			.setAttribute(
																					"name",
																					y.settings.file_data_name);
																	C
																			.setAttribute(
																					"action",
																					y.settings.url);
																	b
																			.each(
																					b
																							.extend(
																									{
																										name : B.target_name
																												|| B.name
																									},
																									y.settings.multipart_params),
																					function(
																							F,
																							D) {
																						var E = a
																								.createElement("input");
																						b
																								.extend(
																										E,
																										{
																											type : "hidden",
																											name : D,
																											value : F
																										});
																						C
																								.insertBefore(
																										E,
																										C.firstChild)
																					});
																	k = B;
																	e("form_"
																			+ q).style.top = -1048575
																			+ "px";
																	C.submit();
																	C.parentNode
																			.removeChild(C)
																});
												p.bind("FileUploaded",
														function(y) {
															y.refresh()
														});
												p
														.bind(
																"StateChanged",
																function(y) {
																	if (y.state == b.STARTED) {
																		u()
																	}
																	if (y.state == b.STOPPED) {
																		d
																				.setTimeout(
																						function() {
																							b
																									.removeEvent(
																											n,
																											"load",
																											y.id);
																							n.parentNode
																									.removeChild(n)
																						},
																						0)
																	}
																});
												p
														.bind(
																"Refresh",
																function(B) {
																	var G, C, D, E, y, H, I, F, A;
																	G = e(B.settings.browse_button);
																	if (G) {
																		y = b
																				.getPos(
																						G,
																						e(B.settings.container));
																		H = b
																				.getSize(G);
																		I = e("form_"
																				+ q);
																		F = e("input_"
																				+ q);
																		b
																				.extend(
																						I.style,
																						{
																							top : y.y
																									+ "px",
																							left : y.x
																									+ "px",
																							width : H.w
																									+ "px",
																							height : H.h
																									+ "px"
																						});
																		if (B.features.canOpenDialog) {
																			A = parseInt(
																					G.parentNode.style.zIndex,
																					10);
																			if (isNaN(A)) {
																				A = 0
																			}
																			b
																					.extend(
																							G.style,
																							{
																								zIndex : A
																							});
																			if (b
																					.getStyle(
																							G,
																							"position") === "static") {
																				b
																						.extend(
																								G.style,
																								{
																									position : "relative"
																								})
																			}
																			b
																					.extend(
																							I.style,
																							{
																								zIndex : A - 1
																							})
																		}
																		D = B.settings.browse_button_hover;
																		E = B.settings.browse_button_active;
																		C = B.features.canOpenDialog ? G
																				: I;
																		if (D) {
																			b
																					.addEvent(
																							C,
																							"mouseover",
																							function() {
																								b
																										.addClass(
																												G,
																												D)
																							},
																							B.id);
																			b
																					.addEvent(
																							C,
																							"mouseout",
																							function() {
																								b
																										.removeClass(
																												G,
																												D)
																							},
																							B.id)
																		}
																		if (E) {
																			b
																					.addEvent(
																							C,
																							"mousedown",
																							function() {
																								b
																										.addClass(
																												G,
																												E)
																							},
																							B.id);
																			b
																					.addEvent(
																							a.body,
																							"mouseup",
																							function() {
																								b
																										.removeClass(
																												G,
																												E)
																							},
																							B.id)
																		}
																	}
																});
												f
														.bind(
																"FilesRemoved",
																function(y, B) {
																	var A, C;
																	for (A = 0; A < B.length; A++) {
																		C = e("form_"
																				+ B[A].id);
																		if (C) {
																			C.parentNode
																					.removeChild(C)
																		}
																	}
																});
												f
														.bind(
																"Destroy",
																function(y) {
																	var A, B, C, D = {
																		inputContainer : "form_"
																				+ q,
																		inputFile : "input_"
																				+ q,
																		browseButton : y.settings.browse_button
																	};
																	for (A in D) {
																		B = e(D[A]);
																		if (B) {
																			b
																					.removeAllEvents(
																							B,
																							y.id)
																		}
																	}
																	b
																			.removeAllEvents(
																					a.body,
																					y.id);
																	b
																			.each(
																					z,
																					function(
																							F,
																							E) {
																						C = e("form_"
																								+ F);
																						if (C) {
																							j
																									.removeChild(C)
																						}
																					})
																});
												v()
											});
							g({
								success : true
							})
						}
					})
})(window, document, plupload);