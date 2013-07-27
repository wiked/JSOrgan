var wikSound =
{
    cnv: {}
    , bg: "#FFFFFF"
    , lastKeyCode: ""
    , lastKeyId: ""
    , lastMeta: ""
    , stx: null
    , bOrgan: true
    
    //, vol: null

    , getCtx: function () {
        var ret = null;
        if (wikSound.cnv != null) {
            ret = wikSound.cnv.getContext("2d");
        }
        return ret;
    }

    , init: function (cnv) {
        wikSound.cnv = cnv;
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

        }
    }

    , createNote: function (stx, pitch, vol) {
        var ret = { vol: null, osc: null };
        ret.vol = stx.createGainNode();
        ret.vol.gain.value = 1;
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

            if (wikSound.keys[evt.keyCode] != null) {
                var note = wikSound.keys[evt.keyCode];

            if (note.vol != null)
                note.vol.gain.value = 0.1;
            }
        }
    }

    

    , keyup: function (evt) {
        if (evt.keyCode != null && wikSound.keys[evt.keyCode] != null) {
            if (wikSound.keys[evt.keyCode].osc != null) {
                //wikSound.notes[evt.keyCode].osc.stop(0);
                wikSound.keys[evt.keyCode].vol.gain.value = 0;
               // wikSound.notes[evt.keyCode].osc = null;
            }
        }
    }

    , notes: {
        f:      { 1: 43.6535, 2: 87.3071, 3: 174.614, 4: 349.228, 5: 698.45, 6: 1396.91 }
        , fs:   { 1: 46.2493, 2: 92.4986, 3: 184.997, 4: 369.994, 5: 739.989, 6: 1479.98 }
        , g:    { 1: 48.9994, 2: 97.9989, 3: 195.998, 4: 391.995, 5: 783.991, 6: 1567.98 }
        , gs:   { 1: 51.9131, 2: 103.826, 3: 207.652, 4: 415.305, 5: 830.609, 6: 1661.22 }
        , a:    { 0: 27.5000, 1: 55.0000, 2: 110.000, 3: 220.00, 4: 440.00, 5: 880.000, 6: 1760.00 }
        , as:   { 0: 29.1352, 1: 58.2705, 2: 116.541, 3: 233.082, 4: 493.883, 5: 932.328, 6: 1864.66 }
        , b:    { 0: 30.8677, 1: 61.7354, 2: 123.471, 3: 246.942, 4: 493.883, 5: 987.767, 6: 1975.53 }
        , c:    { 1: 32.7032, 2: 65.4064, 3: 130.813, 4: 261.626, 5: 1046.50, 6: 1046.50, 7: 2093.00 }
        , cs:   { 1: 34.6478, 2: 69.2957, 3: 138.591, 4: 277.183, 5: 554.365, 6: 1108.73 }
        , d:    { 1: 36.7081, 2: 73.4162, 3: 146.832, 4: 293.665, 5: 587.330, 6: 1174.66 }
        , ds:   { 1: 38.8909, 2: 77.7817, 3: 155.563, 4: 311.127, 5: 622.254, 6: 1244.51 }
        , e:    { 1: 41.2034, 2: 82.4069, 3: 164.814, 4: 329.628, 5: 659.255, 6: 1318.51 }        
    }
    , keys: {
   
        65:
        {

            osc: null
            , vol: null
            , name: "e"
            , pitch: 3
        }
        ,
        83:
        {

            osc: null
            , vol: null
            , name: "f"
            , pitch: 3
        }
        ,69:
        {

            osc: null
            , vol: null
            , name: "fs"
            , pitch: 3
        }
        ,68:
        {

            osc: null
            , vol: null
            , name: "g"
            , pitch: 3
        }
        ,82:
        {

            osc: null
            , vol: null
            , name: "gs"
            , pitch: 3
        }
	    , 70:
        {

            osc: null
            , vol: null
            , name: "a"
            , pitch: 3
        }
        , 84:
        {

            osc: null
            , vol: null
            , name: "as"
            , pitch: 3
        }
        , 71:
        {

            osc: null
            , vol: null
            , name: "b"
            , pitch: 3	
        }

        ,72:
            {
                osc: null
                , vol: null
                , name: "c"
                , pitch: 4
            }
        , 85:
            {

                osc: null
                , vol: null
                , name: "cs"
                , pitch: 4
            }        
        , 74:
            {
                osc: null
                , vol: null
                , name: "d"
                , pitch: 4
            }
        , 73:
            {

                osc: null
                , vol: null
                , name: "ds"
                , pitch: 4
            }
        , 75:
            {
                osc: null
                , vol: null
                , name: "e"
                , pitch: 4
            }
        , 76:
            {
                osc: null
                , vol: null
                , name: "f"
                , pitch: 4
            }
        , 80:
            {
                osc: null
                , vol: null
                , name: "fs"
                , pitch: 4
            }        
        , 186:
            {
                osc: null
                , name: "g"
                , pitch: 4
            }
        , 219:
            {
                osc: null
                , name: "gs"
                , pitch: 4
            }
        , 222:
            {
                osc: null
                , name: "a"
                , pitch: 4
            }
        //415.305

    }
    , setStopVals: function(st)
    {
        var sliderName = "stopSlider" + st;
        var val = (document.getElementById(sliderName).value) / 100.0;
        for (var ikey in wikSound.keys) {
            var key = wikSound.keys[ikey];
            key.osc[st].vol.gain.value = val;
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

        for (var iNote in wikSound.keys) {
            var note = wikSound.keys[iNote];
            if (note != null) {
                if (note.vol == null) {
                    note.vol = stx.createGainNode();
                    note.vol.gain.value = 0.0;
                    note.vol.connect(stx.destination);
                }
               
                note.osc =
                    {
                        2: wikSound.createNote(stx, wikSound.notes[note.name][note.pitch + 2], note.vol)
                        ,4: wikSound.createNote(stx, wikSound.notes[note.name][note.pitch+1], note.vol)
                        ,8: wikSound.createNote(stx, wikSound.notes[note.name][note.pitch], note.vol)
                        , 16: wikSound.createNote(stx, wikSound.notes[note.name][note.pitch - 1], note.vol)
                        , 32: wikSound.createNote(stx, wikSound.notes[note.name][note.pitch - 2], note.vol)

                    };
            }
        }
    }

}

