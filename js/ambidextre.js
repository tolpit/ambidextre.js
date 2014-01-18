(function() {
    'use strict';

    var Ambidextre = {
        movers: [],
        origin: 0,
        gamma: 0,
        verif: null,
        init: function() {
            if(!'DeviceOrientationEvent' in window) return; //Check if navigator support deviceorientation event
            
            this.setMovers();
            window.addEventListener("deviceorientation", this.handleDeviceOrientation, false);

            if(localStorage.getItem('hand')) { //If the user answer before
                if(localStorage.getItem('hand') == -1)
                    this.setOrientation();
                this.noMoreEvents();
            }
        },    
        //Get all the elements to move
        setMovers: function() {
            var elements = document.querySelectorAll('[data-ambidextre]');
            
            for(var i = 0; i < elements.length; i++) 
                this.movers.push(elements[i]);            
        },
        //Apply the change
        setOrientation: function() {
            for(var i = 0; i < this.movers.length; i++) (function(element) {
                element.classList.add(element.getAttribute('data-set'));
            })(this.movers[i]);
        },
        //Detect which hand is in use
        handleDeviceOrientation: function(e) {
            var self = Ambidextre; 
                self.gamma = Math.floor(e.gamma);
                self.origin = (self.origin == 0 ? Math.floor(e.gamma) : self.origin);

            if(self.origin <= -3 && self.verif === null) { //start when y axe is less than -3
                self.verif = setTimeout(function() {
                    if(self.gamma <= -3)
                        self.pop();

                    self.noMoreEvents();
                }, 2000);
            }
        },
        noMoreEvents: function() {
            window.removeEventListener('deviceorientation', this.handleDeviceOrientation, false);
        },
        //Pop a block to ask if the user really use is left hand
        pop: function() {
            var self = this,
                aside = document.createElement('aside'),
                left = document.createElement('button'),
                right = document.createElement('button');

            aside.innerHTML = '<p>Do you use your left hand ?</p>';
            left.textContent = 'Yes';
            right.textContent = 'Nope';

            aside.classList.add('pop');
            left.classList.add('btn-left');
            right.classList.add('btn-right');

            left.addEventListener('click', function() {
                self.setOrientation();
                self.unpop();
                self.saveChoice(-1);
            }, false);
            right.addEventListener('click', function() {
                self.unpop();
                self.saveChoice(1);
            }, false);

            aside.appendChild(left);
            aside.appendChild(right);

            document.querySelector('body').appendChild(aside);
        },
        // Delete the pop block
        unpop: function() {
            if(document.querySelector('.pop'))
                document.querySelector('body').removeChild(document.querySelector('.pop'));
        },
        //We save the user choice in localStorage to automate the change next time
        saveChoice: function(orientation) {
            localStorage.setItem('hand', orientation);
        }
    };

    window.onload = function() {
        Ambidextre.init();
    }
})();