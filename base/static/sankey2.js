d3.sankey = function() {
    function u() {
        i.forEach(function(e) {
            e.sourceLinks = [];
            e.targetLinks = []
        });
        s.forEach(function(e) {
            var t = e.source,
                n = e.target;
            if (typeof t === "number") t = e.source = i[e.source];
            if (typeof n === "number") n = e.target = i[e.target];
            t.sourceLinks.push(e);
            n.targetLinks.push(e)
        })
    }

    function a() {
        i.forEach(function(e) {
            e.value = Math.max(d3.sum(e.sourceLinks, g), d3.sum(e.targetLinks, g))
        })
    }

    function f() {
        function n(r) {
            r.index = t++;
            r.lowIndex = r.index;
            r.onStack = true;
            e.push(r);
            if (r.sourceLinks) {
                r.sourceLinks.forEach(function(e) {
                    var t = e.target;
                    if (!t.hasOwnProperty("index")) {
                        n(t);
                        r.lowIndex = Math.min(r.lowIndex, t.lowIndex)
                    } else if (t.onStack) {
                        r.lowIndex = Math.min(r.lowIndex, t.index)
                    }
                });
                if (r.lowIndex === r.index) {
                    var i = [],
                        s;
                    do {
                        s = e.pop();
                        s.onStack = false;
                        i.push(s)
                    } while (s != r);
                    o.push({
                        root: r,
                        scc: i
                    })
                }
            }
        }
        var e = [],
            t = 0;
        i.forEach(function(e) {
            if (!e.index) {
                n(e)
            }
        });
        o.forEach(function(e, t) {
            e.index = t;
            e.scc.forEach(function(e) {
                e.component = t
            })
        })
    }

    function l() {
        function u(e) {
            return [].concat.apply([], e)
        }

        function a() {
            var e = o,
                t, n, r = 0;
            while (e.length) {
                t = [];
                n = {};
                e.forEach(function(e) {
                    e.x = r;
                    e.scc.forEach(function(r) {
                        r.sourceLinks.forEach(function(r) {
                            if (!n.hasOwnProperty(r.target.component) && r.target.component != e.index) {
                                t.push(o[r.target.component]);
                                n[r.target.component] = true
                            }
                        })
                    })
                });
                e = t;
                ++r
            }
        }

        function f(e, n) {
            var r = [e],
                i = 1,
                s = 0;
            var o = 0;
            while (i > 0) {
                var u = r.shift();
                i--;
                if (!u.hasOwnProperty("x")) {
                    u.x = o;
                    u.dx = t;
                    var a = n(u);
                    r = r.concat(a);
                    s += a.length
                }
                if (i == 0) {
                    o++;
                    i = s;
                    s = 0
                }
            }
        }
        a();
        o.forEach(function(e, t) {
            f(e.root, function(e) {
                var n = e.sourceLinks.filter(function(e) {
                    return e.target.component == t
                }).map(function(e) {
                    return e.target
                });
                return n
            })
        });
        var e = 0;
        var n = d3.nest().key(function(e) {
            return e.x
        }).sortKeys(d3.ascending).entries(o).map(function(e) {
            return e.values
        });
        var e = -1,
            s = -1;
        n.forEach(function(t) {
            t.forEach(function(t) {
                t.x = e + 1;
                t.scc.forEach(function(e) {
                    e.x = t.x + e.x;
                    s = Math.max(s, e.x)
                })
            });
            e = s
        });
        i.filter(function(e) {
            var t = e.sourceLinks.filter(function(e) {
                return e.source.name != e.target.name
            });
            return t.length == 0
        }).forEach(function(t) {
            t.x = e
        });
        p((r[0] - t) / Math.max(e, 1))
    }

    function c() {
        i.forEach(function(e) {
            if (!e.targetLinks.length) {
                e.x = d3.min(e.sourceLinks, function(e) {
                    return e.target.x
                }) - 1
            }
        })
    }

    function h(e) {
        i.forEach(function(t) {
            if (!t.sourceLinks.length) {
                t.x = e - 1
            }
        })
    }

    function p(e) {
        i.forEach(function(t) {
            t.x *= e
        })
    }

    function d(e) {
        function u() {
            var e = d3.min(t, function(e) {
                return (r[1] - (e.length - 1) * n) / d3.sum(e, g)
            });
            t.forEach(function(t) {
                t.forEach(function(t, n) {
                    t.y = n;
                    t.dy = t.value * e
                })
            });
            s.forEach(function(t) {
                t.dy = t.value * e
            })
        }

        function a(e) {
            function n(e) {
                return m(e.source) * e.value
            }
            t.forEach(function(t, r) {
                t.forEach(function(t) {
                    if (t.targetLinks.length) {
                        var r = d3.sum(t.targetLinks, n) / d3.sum(t.targetLinks, g);
                        t.y += (r - m(t)) * e
                    }
                })
            })
        }

        function f(e) {
            function n(e) {
                return m(e.target) * e.value
            }
            t.slice().reverse().forEach(function(t) {
                t.forEach(function(t) {
                    if (t.sourceLinks.length) {
                        var r = d3.sum(t.sourceLinks, n) / d3.sum(t.sourceLinks, g);
                        t.y += (r - m(t)) * e
                    }
                })
            })
        }

        function l() {
            t.forEach(function(e) {
                var t, i, s = 0,
                    o = e.length,
                    u;
                e.sort(c);
                for (u = 0; u < o; ++u) {
                    t = e[u];
                    i = s - t.y;
                    if (i > 0) t.y += i;
                    s = t.y + t.dy + n
                }
                i = s - n - r[1];
                if (i > 0) {
                    s = t.y -= i;
                    for (u = o - 2; u >= 0; --u) {
                        t = e[u];
                        i = t.y + t.dy + n - s;
                        if (i > 0) t.y -= i;
                        s = t.y
                    }
                }
            })
        }

        function c(e, t) {
            return e.y - t.y
        }
        var t = d3.nest().key(function(e) {
            return e.x
        }).sortKeys(d3.ascending).entries(i).map(function(e) {
            return e.values
        });
        u();
        l();
        for (var o = 1; e > 0; --e) {
            f(o *= .99);
            l();
            a(o);
            l()
        }
    }

    function v() {
        function e(e, t) {
            return e.source.y - t.source.y
        }

        function t(e, t) {
            return e.target.y - t.target.y
        }
        i.forEach(function(n) {
            n.sourceLinks.sort(t);
            n.targetLinks.sort(e)
        });
        i.forEach(function(e) {
            var t = 0,
                n = 0;
            e.sourceLinks.forEach(function(e) {
                e.sy = t;
                t += e.dy
            });
            e.targetLinks.forEach(function(e) {
                e.ty = n;
                n += e.dy
            })
        })
    }

    function m(e) {
        return e.y + e.dy / 2
    }

    function g(e) {
        return e.value
    }
    var e = {},
        t = 24,
        n = 8,
        r = [1, 1],
        i = [],
        s = [],
        o = [];
    e.nodeWidth = function(n) {
        if (!arguments.length) return t;
        t = +n;
        return e
    };
    e.nodePadding = function(t) {
        if (!arguments.length) return n;
        n = +t;
        return e
    };
    e.nodes = function(t) {
        if (!arguments.length) return i;
        i = t;
        return e
    };
    e.links = function(t) {
        if (!arguments.length) return s;
        s = t;
        return e
    };
    e.size = function(t) {
        if (!arguments.length) return r;
        r = t;
        return e
    };
    e.layout = function(t) {
        u();
        a();
        f();
        l();
        d(t);
        v();
        return e
    };
    e.relayout = function() {
        v();
        return e
    };
    e.reversibleLink = function() {
        function t(t, n) {
            var r = n.source.x + n.source.dx,
                i = n.target.x,
                s = d3.interpolateNumber(r, i),
                o = s(e),
                u = s(1 - e),
                a = n.source.y + n.sy,
                f = n.target.y + n.ty,
                l = n.source.y + n.sy + n.dy,
                c = n.target.y + n.ty + n.dy;
            switch (t) {
                case 0:
                    return "M" + r + "," + a + "L" + r + "," + (a + n.dy);
                case 1:
                    return "M" + r + "," + a + "C" + o + "," + a + " " + u + "," + f + " " + i + "," + f + "L" + i + "," + c + "C" + u + "," + c + " " + o + "," + l + " " + r + "," + l + "Z";
                case 2:
                    return "M" + i + "," + f + "L" + i + "," + (f + n.dy)
            }
        }

        function n(e, t) {
            function i(e) {
                return e.source.y + e.sy > e.target.y + e.ty ? -1 : 1
            }

            function s(e, t) {
                return e + "," + t + " "
            }
            var n = 30;
            var r = 15;
            var o = i(t) * r,
                u = t.source.x + t.source.dx,
                a = t.source.y + t.sy,
                f = t.target.x,
                l = t.target.y + t.ty;
            switch (e) {
                case 0:
                    return "M" + s(u, a) + "C" + s(u, a) + s(u + n, a) + s(u + n, a + o) + "L" + s(u + n, a + o + t.dy) + "C" + s(u + n, a + t.dy) + s(u, a + t.dy) + s(u, a + t.dy) + "Z";
                case 1:
                    return "M" + s(u + n, a + o) + "C" + s(u + n, a + 3 * o) + s(f - n, l - 3 * o) + s(f - n, l - o) + "L" + s(f - n, l - o + t.dy) + "C" + s(f - n, l - 3 * o + t.dy) + s(u + n, a + 3 * o + t.dy) + s(u + n, a + o + t.dy) + "Z";
                case 2:
                    return "M" + s(f - n, l - o) + "C" + s(f - n, l) + s(f, l) + s(f, l) + "L" + s(f, l + t.dy) + "C" + s(f, l + t.dy) + s(f - n, l + t.dy) + s(f - n, l + t.dy - o) + "Z"
            }
        }
        var e = .5;
        return function(e) {
            return function(r) {
                if (r.source.x < r.target.x) {
                    return t(e, r)
                } else {
                    return n(e, r)
                }
            }
        }
    };
    e.link = function() {
        function t(t) {
            var n = t.source.x + t.source.dx,
                r = t.target.x,
                i = d3.interpolateNumber(n, r),
                s = i(e),
                o = i(1 - e),
                u = t.source.y + t.sy + t.dy / 2,
                a = t.target.y + t.ty + t.dy / 2;
            return "M" + n + "," + u + "C" + s + "," + u + " " + o + "," + a + " " + r + "," + a
        }
        var e = .5;
        t.curvature = function(n) {
            if (!arguments.length) return e;
            e = +n;
            return t
        };
        return t
    };
    return e
}
