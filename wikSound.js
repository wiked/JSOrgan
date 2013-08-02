﻿var wikSound =
{
    cnv: {}
    , bg: "#FFFFFF"
    , lastKeyCode: ""
    , lastKeyId: ""
    , lastMeta: ""
    , lastNote: ""
    , lastPitch: 0
    , usingExternal: true
    , currentOctave: 0
    , stx: null
    , bOrgan: true
    , masterVol: null
    , bShiftDown: false    
    , keyboardMap: [70, 84, 71, 89, 72, 74, 73, 75, 79, 76, 80, 186]
    , keysDown: []
    , keyTypes: []
    , presets:
        {
            1: {
                2: 0.5
                , 4: 0.5
                , 8: 0.5
                , 16: 0.5
                , 32: 0.5
            }
            ,
            2: {
                2: 0.75
                , 4: 0.60
                , 8: 0.60
                , 16: 0.80
                , 32: 1.0
            }
            ,
            3: {
                2: 0.50
                , 4: 0.50
                , 8: 0.50
                , 16: 0.50
                , 32: 0.50
            }
            ,
            4: {
                2: 0.50
                , 4: 0.50
                , 8: 0.50
                , 16: 0.50
                , 32: 0.50
            }
            ,
            5: {
                2: 0.50
                , 4: 0.50
                , 8: 0.50
                , 16: 0.50
                , 32: 0.50
            }
        }

    //, vol: null

    , setExternalChanged: function(thing)
    {
        wikSound.usingExternal = thing.checked;
    }
    , getCtx: function () {
        var ret = null;
        if (wikSound.cnv != null) {
            ret = wikSound.cnv.getContext("2d");
        }
        return ret;
    }

    , initNotes: function () {
        var keyNames = ["c", "cs", "d", "ds", "e", "f", "fs", "g", "gs", "a", "as", "b"];
        
        for (var octave = 0; octave < 8; ++octave) {
            wikSound.notes[octave] = [];
            for (var i in keyNames) {
                var iKey = ((octave * 12) + parseInt(i))-8;
                if (wikSound.notes[keyNames[i]] == null) {
                    wikSound.notes[keyNames[i]] = {};
                }
                var pitch = Math.pow(2, ((iKey - 49) / 12)) * 440.0000;
                if (octave == 0 && parseInt(i) >= 9 && parseInt(i)) {
                    wikSound.notes[keyNames[i]][octave] = pitch;
                }
                else if (octave == 7 && i == 0) {
                    wikSound.notes[keyNames[i]][octave] = pitch;
                }
                else if(octave > 0 && octave < 8) {
                    wikSound.notes[keyNames[i]][octave] = pitch;
                }                
            }

        }

    }

    
    , initKeys: function () {
        var keyNames = ["c", "cs", "d", "ds", "e", "f", "fs", "g", "gs", "a", "as", "b"];
        for (var octave = 0; octave < 8; ++octave) {
            wikSound.keys[octave] = [];
            for (var i in keyNames) {
                var iKey = (octave * 12) + parseInt(i);
                wikSound.keysDown[iKey] = false;
                wikSound.keyTypes[iKey] = keyNames[i].indexOf("s");
                var note = keyNames[i];
                var setPitch = null;
                if (wikSound.notes[note][octave] != null) {
                    setPitch = octave;
                }
                wikSound.keys[octave][i] = {osc:null,vol:null,name:keyNames[i],pitch:setPitch};
            }
        }

    }

    , init: function (cnv) {
        wikSound.cnv = cnv;
        wikSound.initNotes();
        wikSound.initKeys();
        var ctx = wikSound.getCtx();
        wikSound.createAllNotes();
        cnv.onkeydown = wikSound.keydown
        cnv.onkeyup = wikSound.keyup
        ctx.fillStyle = "#000000";
        ctx.fillText("Got here", 50, 50);

    }

    , blankScreen: function (ctx) {
        if (ctx != null) {
            ctx.fillStyle = wikSound.bg;
            ctx.fillRect(0, 0, wikSound.cnv.width, wikSound.cnv.height);
        }
    }

    , repaint: function () {
        if (wikSound.cnv != null) {
            var ctx = wikSound.getCtx();
            wikSound.blankScreen(ctx);
            ctx.fillStyle = "#000000";
            ctx.fillText("Code: " + wikSound.lastKeyCode + ", Id: " + wikSound.lastKeyId + ", meta: " + wikSound.lastMeta, 50, 50);
            ctx.fillText("LastNote: " + wikSound.lastNote + ", Octave: " + wikSound.currentOctave.toString() + ", Last Pitch: " + wikSound.lastPitch.toString(), 50, 65);
            var keyTop = 70;
            var keyLeft = 50;
            var natW = 10;
            var sharpW = 8;
            ctx.strokeStyle = "#000000";
            for (iKey in wikSound.keysDown) {
                var note = { down: wikSound.keysDown[iKey], type: wikSound.keyTypes[iKey] };
                var w = natW;
                var myLeft = keyLeft;
                var h = 30;
                

                if (note.down) {
                    ctx.fillStyle = "#FF00FF";
                }
                else {
                    ctx.fillStyle = "#FFFFFF";
                }
                
                if (note.type >= 0) {
                    if (!note.down) {
                        ctx.fillStyle = "#000000";
                    }
                    myLeft -= 4;
                    h = 15;
                    w = sharpW;
                }
                else {
                    keyLeft += natW;
                }

                ctx.fillRect(myLeft, keyTop, w, h);
                ctx.strokeRect(myLeft, keyTop, w, h);
            }


        }
    }

    , createNote: function (stx, pitch, vol) {
        var ret = { vol: null, osc: null };
        ret.vol = stx.createGainNode();
        ret.vol.gain.value = 0.5;
        ret.vol.connect(vol);
        ret.osc = stx.createOscillator();
        ret.osc.frequency.value = pitch;
        ret.osc.connect(ret.vol);
        ret.osc.start(0);
        return ret;
    }

    , keydown: function (evt) {
        if (evt.keyCode != null || evt.keyIdentifier != null || evt.metaKey != null) {
            if (evt.keyCode != null) {
                wikSound.lastKeyCode = evt.keyCode;
            }

            if (evt.keyIdentifier != null) {
                wikSound.lastKeyId = evt.keyIdentifier;
            }
            if (evt.metaKey != null) {
                wikSound.lastMeta = evt.metaKey;
            }
            wikSound.repaint();

            var octave = 0;
            if (wikSound.usingExternal) {
                var bRepaint = false;
                if (evt.keyCode >= 48 && evt.keyCode <= 57) {
                    wikSound.currentOctave = evt.keyCode - 48;
                    bRepaint = true;
                }
                else if (wikSound.keyboardMap.indexOf(evt.keyCode) > -1) {                    
                    var note = wikSound.keys[wikSound.currentOctave][wikSound.keyboardMap.indexOf(evt.keyCode)];
                    if ( wikSound.notes[note.name][wikSound.currentOctave] != null) {
                        var iKey = (wikSound.currentOctave * 12) + wikSound.keyboardMap.indexOf(evt.keyCode);
                        wikSound.keysDown[iKey] = true;
                        wikSound.lastNote = note.name;
                        wikSound.lastPitch = wikSound.notes[note.name][wikSound.currentOctave];
                        if (note.vol != null) {
                            note.vol.gain.value = 0.5;
                        }
                        bRepaint = true;
                    }
                }

                if (bRepaint) {
                    wikSound.repaint();
                }

            }
            else {


                if (wikSound.keys[evt.keyCode] != null) {
                    var note = wikSound.keys[evt.keyCode];
                    if (note.vol != null) {
                        note.vol.gain.value = 0.1;
                    }
                }
                else {
                    if (evt.keyCode == 16) {
                        wikSound.bShiftDown = true;
                    }
                    else if (evt.keyCode > 48 && evt.keyCode < 54) {
                        var st = evt.keyCode - 48;
                        if (wikSound.bShiftDown) {
                            wikSound.setPreset(st);
                        }
                        else {
                            wikSound.execPreset(st);
                        }
                    }

                }
            }
        }
    }

    

    , keyup: function (evt) {
        if (evt.keyCode != null) {
            if (wikSound.usingExternal) {
                if (wikSound.keyboardMap.indexOf(evt.keyCode) > -1) {
                    var key = wikSound.keys[wikSound.currentOctave][wikSound.keyboardMap.indexOf(evt.keyCode)];
                    var iKey = (wikSound.currentOctave * 12) + wikSound.keyboardMap.indexOf(evt.keyCode);
                    wikSound.keysDown[iKey] = false;
                    if (key.osc != null) {
                        key.vol.gain.value = 0;
                    }
                    wikSound.repaint();
                }
            }
            else {
                if (wikSound.keys[evt.keyCode] != null) {
                    if (wikSound.keys[evt.keyCode].osc != null) {
                        //wikSound.notes[evt.keyCode].osc.stop(0);
                        wikSound.keys[evt.keyCode].vol.gain.value = 0;
                        // wikSound.notes[evt.keyCode].osc = null;
                    }
                }
                else {
                    if (evt.keyCode == 16) {
                        wikSound.bShiftDown = false;
                    }
                }
            }
        }
    }

    /*
    88	c′′′′′ 5-line octave	C8 Eighth octave	4186.01					
87	b′′′′	B7	3951.07					
86	a♯′′′′/b♭′′′′	A♯7/B♭7	3729.31					
85	a′′′′	A7	3520.00					
84	g♯′′′′/a♭′′′′	G♯7/A♭7	3322.44					
83	g′′′′	G7	3135.96					
82	f♯′′′′/g♭′′′′	F♯7/G♭7	2959.96					
81	f′′′′	F7	2793.83					
80	e′′′′	E7	2637.02					
79	d♯′′′′/e♭′′′′	D♯7/E♭7	2489.02					
78	d′′′′	D7	2349.32					
77	c♯′′′′/d♭′′′′	C♯7/D♭7	2217.46					
76	c′′′′ 4-line octave	C7 Double high C	2093.00					
75	b′′′	B6	1975.53					
74	a♯′′′/b♭′′′	A♯6/B♭6	1864.66					
73	a′′′	A6	1760.00					
72	g♯′′′/a♭′′′	G♯6/A♭6	1661.22					
71	g′′′	G6	1567.98					
70	f♯′′′/g♭′′′	F♯6/G♭6	1479.98					
69	f′′′	F6	1396.91					
68	e′′′	E6	1318.51					
67	d♯′′′/e♭′′′	D♯6/E♭6	1244.51					
66	d′′′	D6	1174.66					
65	c♯′′′/d♭′′′	C♯6/D♭6	1108.73					
64	c′′′ 3-line octave	C6 Soprano C (High C)	1046.50
    */
    , notes: {
        //f:      { 0:21 1: 43.6535, 2: 87.3071, 3: 174.614, 4: 349.228, 5: 698.45, 6: 1396.91 }
        //, fs:   { 1: 46.2493, 2: 92.4986, 3: 184.997, 4: 369.994, 5: 739.989, 6: 1479.98 }
        //, g:    { 1: 48.9994, 2: 97.9989, 3: 195.998, 4: 391.995, 5: 783.991, 6: 1567.98 }
        //, gs:   { 1: 51.9131, 2: 103.826, 3: 207.652, 4: 415.305, 5: 830.609, 6: 1661.22 }
        //, a:    { 0: 27.5000, 1: 55.0000, 2: 110.000, 3: 220.00,  4: 440.00, 5: 880.000, 6: 1760.00 }
        //, as:   { 0: 29.1352, 1: 58.2705, 2: 116.541, 3: 233.082, 4: 466.164, 5: 932.328, 6: 1864.66 }
        //, b:    { 0: 30.8677, 1: 61.7354, 2: 123.471, 3: 246.942, 4: 493.883, 5: 987.767, 6: 1975.53 }
        //, c: { 1: 32.7032, 2: 65.4064, 3: 130.813, 4: 261.626, 5: 523.2512, 6: 1046.50, 7: 2093.00, 8: 4186.01 }
        //, cs:   { 1: 34.6478, 2: 69.2957, 3: 138.591, 4: 277.183, 5: 554.365, 6: 1108.73 }
        //, d:    { 1: 36.7081, 2: 73.4162, 3: 146.832, 4: 293.665, 5: 587.330, 6: 1174.66 }
        //, ds:   { 0: 19.4455, 1: 38.8909, 2: 77.7817, 3: 155.563, 4: 311.127, 5: 622.254, 6: 1244.51 }
        //, e:    { 1: 41.2034, 2: 82.4069, 3: 164.814, 4: 329.628, 5: 659.255, 6: 1318.51 }        
    }
    
    , keys: []       
        //, 81:
        //    {
        //        osc: null
        //        , name: "a"
        //        , pitch: 6
        //    }

        //415.305   
    , setStop: function (st, val)
    {
        for (var octave in wikSound.keys) {
            for (var ikey in wikSound.keys[octave]) {
                var key = wikSound.keys[octave][ikey];
                key.osc[st].vol.gain.value = val;
            }
        }
    }
    , setStopVals: function(st)
    {
        var sliderName = "stopSlider" + st;
        var val = (document.getElementById(sliderName).value) / 100.0;
        if (st == "Master") {
            wikSound.masterVol.gain.value = val;
        }
        else {
            wikSound.setStop(st, val);
        }
        
    }
    , execPreset: function (pr) {
        if (wikSound.presets[pr] != null) {
            for (var st in wikSound.presets[pr]) {
                wikSound.setStop(st, wikSound.presets[pr][st]);
                var sl = document.getElementById("stopSlider" + st);
                if (sl != null) {
                    sl.value = wikSound.presets[pr][st] * 100;
                }
            }
        }
    }
    , setPreset: function (pr) {
        if (wikSound.presets[pr] != null) {
            for (var st in wikSound.presets[pr]) {
                var sl = document.getElementById("stopSlider" + st);
                if (sl != null) {
                    wikSound.presets[pr][st] = sl.value / 100.0;
                }
            }
        }
    }
    , createAllNotes: function () {
        var stx = null;
        if (wikSound.stx == null) {
            stx = new webkitAudioContext();
            wikSound.stx = stx;
        } 
        else {
            stx = wikSound.stx;
        }
        wikSound.masterVol = stx.createGainNode();
        wikSound.masterVol.connect(stx.destination);
        wikSound.masterVol.gain.value = 0.50;

        for (var octave in wikSound.keys) {
            for (var iNote in wikSound.keys[octave]) {
                var note = wikSound.keys[octave][iNote];
                if (note != null) {
                    if (note.vol == null) {
                        note.vol = stx.createGainNode();
                        note.vol.gain.value = 0.0;
                        note.vol.connect(wikSound.masterVol);
                    }

                    note.osc =
                        {
                            2: wikSound.createNote(stx, wikSound.notes[note.name][note.pitch + 2], note.vol)
                            , 4: wikSound.createNote(stx, wikSound.notes[note.name][note.pitch + 1], note.vol)
                            , 8: wikSound.createNote(stx, wikSound.notes[note.name][note.pitch], note.vol)
                            , 16: wikSound.createNote(stx, wikSound.notes[note.name][note.pitch - 1], note.vol)
                            , 32: wikSound.createNote(stx, wikSound.notes[note.name][note.pitch - 2], note.vol)

                        };
                }
            }
        }
        
    }

}

