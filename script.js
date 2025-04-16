function setupEventListeners() {
    // Attach change event to all solute radio buttons
    document.querySelectorAll('input[name="solute"]').forEach(radio => {
      radio.addEventListener('change', populateSoluteValues);
    });

    document.getElementById('weight').addEventListener('input', populateSoluteValues);
    document.getElementById('height').addEventListener('input', populateSoluteValues);
    document.getElementById('sex').addEventListener('change', populateSoluteValues);
}


document.addEventListener("DOMContentLoaded", () => {
    setupEventListeners();
    // Call the function immediately to populate defaults
    populateSoluteValues();
});


function computeVolume(weight, height, sex) {
    const weightError = document.getElementById('weightError');
    const heightError = document.getElementById('heightError');
    const sexError = document.getElementById('sexError');

    weightError.textContent = '';
    heightError.textContent = '';
    sexError.textContent = '';

    if (!weight){
        weightError.textContent = 'A number is required';
        return "";
    }
    if (!height){
        heightError.textContent = 'A number is required';
        return "";
    }
    if (sex != "M" && sex != "F"){
        sexError.textContent = 'A number is required';
        return "";
    }

    weight = parseFloat(weight);
    height = parseFloat(height);
    
    if (sex === 'M') {
      return (0.194786 * height + 0.296785 * weight - 14.012934);
    } else if (sex === 'F') {
      return (0.34454 * height + 0.183809 * weight - 35.270121);
    } else {
      return '';
    }
}


function populateSoluteValues() {
    const soluteData = {
        urea: {
          mtac: 23,         // Default MTAC for Urea
        },
        creatinine: {
          mtac: 12,         // Default MTAC for Creatinine
        },
        other: {
          mtac: '',         // No default value for 'other'
          volume: ''        // No default value for 'other'
        }
    };
       
    const selectedRadio = document.querySelector('input[name="solute"]:checked');
    if (!selectedRadio) return; 
  
    const selectedSolute = selectedRadio.value;
    document.getElementById('mtac').value = soluteData[selectedSolute].mtac;
    document.getElementById('volume').value = soluteData[selectedSolute].volume;

    const weight = document.getElementById('weight').value;
    const height = document.getElementById('height').value;
    const sex = document.getElementById('sex').value; 
    
    const volumeField = document.getElementById('volume');

    if (selectedSolute === 'urea' || selectedSolute === 'creatinine') {
        const computedVolume = computeVolume(weight, height, sex);
        volumeField.value = computedVolume;
    } else {
        // For 'other', clear the volume field (or leave as user-set)
        volumeField.value = soluteData[selectedSolute].volume;
    }
    
    // If 'other' is selected, display a message prompting the user to enter custom values.
    const errorDiv = document.getElementById('soluteError');
    if (selectedSolute === 'other') {
      errorDiv.textContent = "Please enter custom MTAC and Volume values for 'Other'.";
    } else {
      errorDiv.textContent = "";
    }
}
  

function validateForm() {

    // Clear previous error messages
    document.querySelectorAll('.error').forEach(function(error) {
        error.textContent = '';
        hasErrors = false;
    });

    var age = document.getElementById('age').value;
    var height = document.getElementById('height').value;
    var weight = document.getElementById('weight').value;
    var sex = document.getElementById('sex').value;
    var pna = document.getElementById('pna').value;
    var kru = document.getElementById('kru').value;
    var solute = document.querySelector('input[name="solute"]:checked').value;
    var mtac = document.getElementById('mtac').value;
    var volume = document.getElementById('volume').value;
    var m_fluid_removal = document.getElementById('m_fluid_removal').value;
    var a_fluid_removal = document.getElementById('a_fluid_removal').value;

    var days = document.querySelectorAll('input[name="day"]:checked');
    var hasErrors = false;

    // Check age
    if (age.trim() === '') {
        document.getElementById('ageError').textContent = 'A number is required';
        hasErrors = true;
    } else if (isNaN(age)) {
        document.getElementById('ageError').textContent = 'A number is required';
        hasErrors = true;
    } else if (age < 0){
        document.getElementById('ageError').textContent = 'Number has to be greater or equal to 0';
        hasErrors = true;
    } else if (age > 150){
        document.getElementById('ageError').textContent = 'Number has to be smaller than 150. Make sure you are inputting for age';
        hasErrors = true;
    }
    // Check height
    if (height.trim() === '') {
        document.getElementById('heightError').textContent = 'A number is required';
        hasErrors = true;
    } else if (isNaN(height)) {
        document.getElementById('heightError').textContent = 'A number is required';
        hasErrors = true;
    } else if (height < 0) {
        document.getElementById('heightError').textContent = 'Number has to be greater or equal to 0';
        hasErrors = true;
    } else if (height > 300) {0
        document.getElementById('heightError').textContent = 'Number has to be smaller than 300, make sure input is in cm';
        hasErrors = true;
    }
    
    // Check weight
    if (weight.trim() === '') {
        document.getElementById('weightError').textContent = 'A number is required';
        hasErrors = true;
    } else if (isNaN(weight)) {
        document.getElementById('weightError').textContent = 'A number is required';
        hasErrors = true;
    } else if (weight < 0) {
        document.getElementById('weightError').textContent = 'Number has to be greater or equal to 0';
        hasErrors = true;
    } else if (weight > 700){
        document.getElementById('weightError').textContent = 'Number has to be smaller than 700, make sure input is in kg';
        hasErrors = true;
    }

    // Check sex -- make sure that something has been selected
    if (sex.trim() === '') {
        document.getElementById('sexError').textContent = 'Please select a sex';
        hasErrors = true;
    }
    
    // Check pna
    if (pna.trim() === '') {
        document.getElementById('pnaError').textContent = 'A number is required';
        hasErrors = true;
    } else if (isNaN(pna)) {
        document.getElementById('pnaError').textContent = 'A number is required';
        hasErrors = true;
    } else if (pna < 0) {
        document.getElementById('pnaError').textContent = 'Number has to be greater or equal to 0';
        hasErrors = true;
    }

    // Check kru
    if (kru.trim() === '') {
        document.getElementById('kruError').textContent = 'A number is required';
        hasErrors = true;
    } else if (isNaN(kru)) {
        document.getElementById('kruError').textContent = 'A number is required';
        hasErrors = true;
    } else if (kru < 0) {
        document.getElementById('kruError').textContent = 'Number has to be greater or equal to 0';
        hasErrors = true;
    }

    // Check solute -- make sure something has been selected
    if (solute.trim() === '') {
        document.getElementById('soluteError').textContent = 'Please select a solute';
        hasErrors = true;
    }

    // Check mtac
    if (mtac.trim() === '') {
        document.getElementById('mtacError').textContent = 'A number is required';
        hasErrors = true;
    } else if (isNaN(mtac)) {
        document.getElementById('mtacError').textContent = 'A number is required';
        hasErrors = true;
    } else if (mtac < 0) {
        document.getElementById('mtacError').textContent = 'Number has to be greater or equal to 0';
        hasErrors = true;
    }

    // Check volume 
    if (volume.trim() === '') {
        document.getElementById('volumeError').textContent = 'A number is required';
        hasErrors = true;
    } else if (isNaN(volume)) {
        document.getElementById('volumeError').textContent = 'A number is required';
        hasErrors = true;
    } else if (volume < 0) {
        document.getElementById('volumeError').textContent = 'Number has to be greater or equal to 0';
        hasErrors = true;
    }

    // Check m_fluid_removal
    if (m_fluid_removal.trim() === '') {
        document.getElementById('mFluidRemovalError').textContent = 'A number is required';
        hasErrors = true;
    } else if (isNaN(m_fluid_removal)) {
        document.getElementById('mFluidRemovalError').textContent = 'A number is required';
        hasErrors = true;
    } else if (m_fluid_removal < 0) {
        document.getElementById('mFluidRemovalError').textContent = 'Number has to be greater or equal to 0';
        hasErrors = true;
    }

    // Check a_fluid_removal
    if (a_fluid_removal.trim() === '') {
        document.getElementById('aFluidRemovalError').textContent = 'A number is required';
        hasErrors = true;
    } else if (isNaN(a_fluid_removal)) {
        document.getElementById('aFluidRemovalError').textContent = 'A number is required';
        hasErrors = true;
    } else if (a_fluid_removal < 0) {
        document.getElementById('aFluidRemovalError').textContent = 'Number has to be greater or equal to 0';
        hasErrors = true;
    }

    // Check if at least one day is selected
    if (days.length === 0) {
        document.getElementById('daysError').textContent = 'Please select at least one day';
        hasErrors = true;
    }

    // Check time 
    let total = 0;
    // Select all inputs whose id starts with "exTime"
    const timeInputs = document.querySelectorAll("input[id^='exTime']");
    timeInputs.forEach(function(input) {
        const value = parseFloat(input.value);
        if (!isNaN(value)) {
        total += value;
        }
    });
    
    // Get the error message container
    const errorMessage = document.getElementById('timeError');
    
    // Check if the total time is 24 or not.
    if (total > 24) {
        errorMessage.textContent = "The total time cannot be over 24 hours (currently " + total + " hours).";
        hasErrors = true;
    } 

    if (!hasErrors){
        submitForm();
    }
}


async function submitForm() {
    var age = parseFloat(document.getElementById('age').value);
    var height = parseFloat(document.getElementById('height').value);
    var weight = parseFloat(document.getElementById('weight').value);
    var sex = parseFloat(document.getElementById('sex').value);
    var kru = parseFloat(document.getElementById('kru').value);
    var solute = parseFloat(document.getElementById('solute').value);
    var mtac = parseFloat(document.getElementById('mtac').value);
    var volume = parseFloat(document.getElementById('volume').value);

    var m_fluid_removal = parseFloat(document.getElementById('m_fluid_removal').value);
    var a_fluid_removal = parseFloat(document.getElementById('a_fluid_removal').value);
    var days = Array.from(document.querySelectorAll('input[name="day"]:checked')).map(day => day.value);

    var volumeData = [];
    var timeData = [];
    var schemeData = [];
    var totDayTime = 0;
    var totNightTime = 0;

    for (var i = 1; i <= 7; i++) {
        // Construct the ID for the current element

        var currentId = 'exVolume ' + i;
        // Get the element by its ID
        var element = document.getElementById(currentId);

        // Check if the element exists
        if (element) {
            volumeValue = element.value;
            // Parse the element's text content into a float value and push it into the volumeData array
            // Check if the parsed value is a valid float
            if (volumeValue != 0){ // If it's a valid float
                volumeData.push(volumeValue); // Push the float value into the volumeData array
            }
        }

        var currentId = 'exTime ' + i;
        var element = document.getElementById(currentId);

        // Check if the element exists
        if (element) {
            timeValue = parseFloat(element.value);
            // Parse the element's text content into a float value and push it into the volumeData array
            // Check if the parsed value is a valid float
            if (timeValue != 0){ // If it's a valid float
                timeData.push(timeValue); // Push the float value into the volumeData array
            }
        }

        var currentId = 'exScheme ' + i;
        var element = document.getElementById(currentId);

        // Check if the element exists
        if (element) {
            schemeValue = element.value;
            // Parse the element's text content into a float value and push it into the volumeData array
            // Check if the parsed value is a valid float
            if (schemeValue != 'None'){ // If it's a valid float
                schemeData.push(schemeValue); // Push the float value into the volumeData array
            }
            if (schemeValue == "A"){
                totNightTime = totNightTime + timeValue - deadNight;
            }
            else if (schemeValue == "M"){
                totDayTime = totDayTime + timeValue - deadDay;
            }
        }
    }
    try {
    
        const [plasmaConcentration, volumeofDistribution, peakConcentration, dialysateConcentration, volDialysate] = await pdCalculator(deadNight, deadDay, ufNight, ufDay, volumeData, timeData, schemeData, days, totDayTime, totNightTime, mtac, volume, kr, gen);
        updateGraphVar(plasmaConcentration, volumeofDistribution, dialysateConcentration, volDialysate)
        updateNumerical(plasmaConcentration, peakConcentration, gen, volumeofDistribution)

        const graphVarRadios = document.querySelectorAll('input[name="variable"]');
        graphVarRadios.forEach(radio => {
            radio.addEventListener('change', () => {
                updateGraphVar(plasmaConcentration, volumeofDistribution, dialysateConcentration, volDialysate);
            });
        });

        const graphZoomRadios = document.querySelectorAll('input[name="zoom"]');
        graphZoomRadios.forEach(radio => {
            radio.addEventListener('change', () => {
                updateGraphVar(plasmaConcentration, volumeofDistribution, dialysateConcentration, volDialysate);
            });
        });

        const graphAvgRadios = document.querySelectorAll('input[name="add"]');
        graphAvgRadios.forEach(radio => {
            radio.addEventListener('change', () => {
                updateGraphVar(plasmaConcentration, volumeofDistribution, dialysateConcentration, volDialysate);
            });
        });

    } catch (error) {
        console.error("Error:", error);
    }
}


function defaultInput() {

    var age = 50;
    var weight = 81;
    var height = 175;
    var sex = "M";

    var checkboxes = document.querySelectorAll('.days-of-week input[type="checkbox"]');
        checkboxes.forEach(function(checkbox) {
            checkbox.checked = true;
    });

    var days = document.querySelectorAll('input[name="day"]:checked');

    volumeData = [2, 2, 2, 2];
    timeData = [2.25, 2.25, 2.25, 12.25];
    schemeData = ["A", "A", "A", "M"];

    var m_fluid_removal = 200;
    var a_fluid_removal = 800;

    displayDefaultValues(age, weight, height, sex, volume, days, volumeData, timeData, schemeData, m_fluid_removal, a_fluid_removal);

    const defaultSolute = document.querySelector('input[name="solute"][value="urea"]');
    if (defaultSolute) {
        defaultSolute.checked = true;
        populateSoluteValues();
    }

    const selectedSolute = document.querySelector('input[name="solute"]:checked').value
}


function displayDefaultValues(age, weight, height, sex, volume, days, volumeData, timeData, schemeData, m_fluid_removal, a_fluid_removal){
    document.getElementById('mtac').value = mtac;
    document.getElementById('volume').value = volume;
    document.getElementById('age').value = age;
    document.getElementById('weight').value = weight;
    document.getElementById('height').value = height;
    document.getElementById('sex').value = sex;
    
    // Set default values for volumeData, timeData, and schemeData
    for (var i = 0; i < volumeData.length; i++) {
        document.getElementById('exVolume ' + (i + 1)).value = volumeData[i];
        document.getElementById('exTime ' + (i + 1)).value = timeData[i];
        document.getElementById('exScheme ' + (i + 1)).value = schemeData[i];
    }
}


function pdCalculator(deadNight, deadDay, ufNight, ufDay, volumeData, timeData, schemeData, days, totDayTime, totNightTime, mtac, volume, kr, gen){
    gen = gen / (24*60);
    var numExchange = volumeData.length;
    var numOfTreatment = days.length;
    let plasmaConcentration = new Array(7 * 24 * 60).fill(0);
    let peakConcentration = new Array(numExchange * numOfTreatment).fill(0);
    let dialysateConcentration = new Array(7 * 24 * 60).fill(0);
    let volumeofDistribution = new Array(7 * 24 * 60).fill(0);
    let volDialysate = new Array(7 * 24 * 60).fill(0);
    let amountDialysate = new Array(7 * 24 * 60).fill(0);
    let plasmaToDialysate = new Array(7 * 24 * 60).fill(0);
    let amountBody = new Array(7 * 24 * 60).fill(0);
    let netMovtIn = new Array(7 * 24 * 60).fill(0);
    let excretion = new Array(7 * 24 * 60).fill(0);

    let initial_equilibrium_tolerance = 0.001;
    let initial_steady_state = 0;
    let initial_Concentration = 1;
    let t = 1;
    let peak_index = 0;

    let fluidAddedDay = (ufDay * 1000) / (totDayTime * 60); // mL / min
    let fluidAddedNight = (ufNight * 1000) / (totNightTime * 60); // mL / min
    let volume_intake = ((ufDay + ufNight) * 1000) / 1440; // mL/min
    var daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    
    while (initial_steady_state == 0) {
        plasmaConcentration[0] = initial_Concentration
        dialysateConcentration[0] = 0
        volumeofDistribution[0] = volume
        amountDialysate[0] = 0
        amountBody[0] = plasmaConcentration[0] * volume * 10
        volDialysate[0] = volumeData[0] * 1000
        excretion[0] = plasmaConcentration[0] * kr / 100
        plasmaToDialysate[0] = (plasmaConcentration[0] - dialysateConcentration[0])*mtac/100
        netMovtIn[0] = gen - excretion[0] - plasmaToDialysate[0]

        // Above here is tested and should run ok - June 22nd
        for (let day = 0; day < 7; day++) {
            if (days.includes(daysOfWeek[day])) {
                for (let exchange = 0; exchange < numExchange; exchange++){
                    if (schemeData[exchange] == "Night") {
                        peakConcentration[peak_index] = plasmaConcentration[t - 1]
                        peak_index = peak_index + 1
                        
                        duration = (timeData[exchange] - deadNight) * 60
                        initialTime = t
                        
                        // Above here is tested and should run ok - June 22nd

                        if (initialTime != 1){  
                            volumeofDistribution[t] = volumeofDistribution[t - 1] + (volume_intake - fluidAddedNight)/1000
                            volDialysate[t] = volumeData[exchange] * 1000
                            plasmaConcentration[t] = ((plasmaConcentration[t - 1] * 10 * volumeofDistribution[t-1]) + netMovtIn[t - 1])/(volumeofDistribution[t] * 10)
                            amountDialysate[t] = 0
                            dialysateConcentration[t] = 0
                            plasmaToDialysate[t] = (plasmaConcentration[t] - dialysateConcentration[t])*mtac/100
                            amountBody[t] = amountBody[t-1] * netMovtIn[t - 1]
                            excretion[t] = plasmaConcentration[t] * kr / 100
                            netMovtIn[t] = gen - excretion[t] - plasmaToDialysate[t]
                            t = t + 1
                        }
                        while (t < (initialTime + duration)){
                            volumeofDistribution[t] = volumeofDistribution[t - 1] + (volume_intake - fluidAddedNight)/1000
                            volDialysate[t] = volDialysate[t - 1] + fluidAddedNight
                            plasmaConcentration[t] = ((plasmaConcentration[t - 1] * 10 * volumeofDistribution[t-1]) + netMovtIn[t - 1])/(volumeofDistribution[t] * 10)
                            amountDialysate[t] = amountDialysate[t - 1] + plasmaToDialysate[t - 1]
                            dialysateConcentration[t] = amountDialysate[t] / volDialysate[t] * 100
                            plasmaToDialysate[t] = (plasmaConcentration[t] - dialysateConcentration[t])*mtac/100
                            amountBody[t] = amountBody[t-1] * netMovtIn[t - 1]
                            excretion[t] = plasmaConcentration[t] * kr / 100
                            netMovtIn[t] = gen - excretion[t] - plasmaToDialysate[t]
                            t = t + 1
                        }

                        while (t >= (initialTime + duration) && t < (initialTime + timeData[exchange] * 60)) {
                            volumeofDistribution[t] = volumeofDistribution[t - 1] + (volume_intake)/1000
                            volDialysate[t] = 0
                            plasmaConcentration[t] = ((plasmaConcentration[t - 1] * 10 * volumeofDistribution[t-1]) + netMovtIn[t - 1])/(volumeofDistribution[t] * 10)
                            amountDialysate[t] = 0
                            dialysateConcentration[t] = 0
                            plasmaToDialysate[t] = 0
                            amountBody[t] = amountBody[t-1] * netMovtIn[t - 1]
                            excretion[t] = plasmaConcentration[t] * kr / 100
                            netMovtIn[t] = gen - excretion[t]
                            t = t + 1
                        }
                    }

                    if (schemeData[exchange] == "Day") {
                        peakConcentration[peak_index] = plasmaConcentration[t - 1]
                        peak_index = peak_index + 1
                        
                        duration = (timeData[exchange] - deadDay) * 60
                        initialTime = t
                        
                        if (initialTime != 1){  
                            volumeofDistribution[t] = volumeofDistribution[t - 1] + (volume_intake - fluidAddedDay)/1000
                            volDialysate[t] = volumeData[exchange] * 1000
                            plasmaConcentration[t] = ((plasmaConcentration[t - 1] * 10 * volumeofDistribution[t-1]) + netMovtIn[t - 1])/(volumeofDistribution[t] * 10)
                            amountDialysate[t] = 0
                            dialysateConcentration[t] = 0
                            plasmaToDialysate[t] = (plasmaConcentration[t] - dialysateConcentration[t])*mtac/100
                            amountBody[t] = amountBody[t-1] * netMovtIn[t - 1]
                            excretion[t] = plasmaConcentration[t] * kr / 100
                            netMovtIn[t] = gen - excretion[t] - plasmaToDialysate[t]
                            t = t + 1
                        }
                        
                        while (t < (initialTime + duration)){
                            volumeofDistribution[t] = volumeofDistribution[t - 1] + (volume_intake - fluidAddedDay)/1000
                            volDialysate[t] = volDialysate[t - 1] + fluidAddedDay
                            plasmaConcentration[t] = ((plasmaConcentration[t - 1] * 10 * volumeofDistribution[t-1]) + netMovtIn[t - 1])/(volumeofDistribution[t] * 10)
                            amountDialysate[t] = amountDialysate[t - 1] + plasmaToDialysate[t - 1]
                            dialysateConcentration[t] = amountDialysate[t] / volDialysate[t] * 100
                            plasmaToDialysate[t] = (plasmaConcentration[t] - dialysateConcentration[t])*mtac/100
                            amountBody[t] = amountBody[t-1] * netMovtIn[t - 1]
                            excretion[t] = plasmaConcentration[t] * kr / 100
                            netMovtIn[t] = gen - excretion[t] - plasmaToDialysate[t]
                            t = t + 1
                        }

                        while (t >= (initialTime + duration) && t < (initialTime + timeData[exchange] * 60)) {
                            volumeofDistribution[t] = volumeofDistribution[t - 1] + (volume_intake)/1000
                            volDialysate[t] = 0
                            plasmaConcentration[t] = ((plasmaConcentration[t - 1] * 10 * volumeofDistribution[t-1]) + netMovtIn[t - 1])/(volumeofDistribution[t] * 10)
                            amountDialysate[t] = 0
                            dialysateConcentration[t] = 0
                            plasmaToDialysate[t] = 0
                            amountBody[t] = amountBody[t-1] * netMovtIn[t - 1]
                            excretion[t] = plasmaConcentration[t] * kr / 100
                            netMovtIn[t] = gen - excretion[t]
                            t = t + 1
                        }
                    }

                    while (t < (day + 1) * (24 * 60)){
                        volumeofDistribution[t] = volumeofDistribution[t - 1] + (volume_intake)/1000
                        volDialysate[t] = 0
                        plasmaConcentration[t] = ((plasmaConcentration[t - 1] * 10 * volumeofDistribution[t-1]) + netMovtIn[t - 1])/(volumeofDistribution[t] * 10)
                        amountDialysate[t] = 0
                        dialysateConcentration[t] = 0
                        plasmaToDialysate[t] = 0
                        amountBody[t] = amountBody[t-1] * netMovtIn[t - 1]
                        excretion[t] = plasmaConcentration[t] * kr / 100
                        netMovtIn[t] = gen - excretion[t]
                        t = t + 1
                    }
                }   
            }
            else{
                tfinal = t + 24*60
                peakConcentration[peak_index] = plasmaConcentration[t-1]
                peak_index  = peak_index + 1

                while (t < tfinal){
                    volumeofDistribution[t] = volumeofDistribution[t - 1] + (volume_intake)/1000
                    volDialysate[t] = 0
                    plasmaConcentration[t] = ((plasmaConcentration[t - 1] * 10 * volumeofDistribution[t-1]) + netMovtIn[t - 1])/(volumeofDistribution[t] * 10)
                    amountDialysate[t] = 0
                    dialysateConcentration[t] = 0
                    plasmaToDialysate[t] = 0
                    amountBody[t] = amountBody[t-1] * netMovtIn[t - 1]
                    excretion[t] = plasmaConcentration[t] * kr / 100
                    netMovtIn[t] = gen - excretion[t]
                    t = t + 1
                }
            }
            console.log('day, t', day, t)
        }
        if (Math.abs(plasmaConcentration[t - 1] - initial_Concentration) < (initial_equilibrium_tolerance * initial_Concentration)){
            initial_steady_state = 1
            console.log(plasmaConcentration)
        }
        else{
            initial_Concentration = plasmaConcentration[t - 1]
            t = 1
            peak_index = 0
        }
    } 
    return ([plasmaConcentration, volumeofDistribution, peakConcentration, dialysateConcentration, volDialysate])                  
}


function renderChart(dataSet, name, zoom, average) {
    // Set default options for all charts
    Chart.defaults.font.size = 15;
    Chart.defaults.font.family = "Manrope";

    // Check if chart exists and destroy it before rendering a new one
    var chartStatus = Chart.getChart("chartCanvas");
    if (chartStatus !== undefined) {
        chartStatus.destroy();
    }

    var data = [];

    var data1 = {        
        label: name,
        data: dataSet,
        borderColor: '#2A9D8F',
        fill: false
    };

    data.push(data1);

    if (average && dataSet.length > 0) { // Only calculate average if dataSet is not empty
        var sum = dataSet.reduce((acc, value) => acc + value, 0);
        var avg = sum / dataSet.length;

        var data2 = {
            label: "Average",
            data: Array(dataSet.length).fill(avg),
            borderColor: '#E76F51',
            fill: false
        };

        data.push(data2);
    }

    const labels = Array.from({ length: dataSet.length }, (_, i) => i.toString()); // Adjust as needed

    var options = {
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Time (minutes)'
                },
                min: 0,
                ticks: {
                    maxTicksLimit: 10,
                    font: {
                        family: "Manrope",
                        size: 15
                    }
                }
            },
            y: {
                title: {
                    display: true,
                    text: name
                },
                ticks: {
                    beginAtZero: true,
                    font: {
                        family: "Manrope",
                        size: 15
                    }
                },
                min: zoom
            }
        },
        plugins: {
            legend: {
                labels: {
                    font: {
                        family: 'Manrope', // font for legend labels
                        size: 15,
                        style: 'normal',
                        lineHeight: 1.2
                    }
                }
            }
        }
    };

    // Get the canvas context and create the chart instance
    const ctx = document.getElementById('chartCanvas').getContext('2d');
    var linechart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: data
        },
        options: options
    });
}


function updateNumerical(plasmaConcentration, peakConcentration, gen, volumeofDistribution) {
    if (plasmaConcentration.length === 0) avg = 0; // Handle empty array case

    var sum = plasmaConcentration.reduce((plasmaConcentration, value) => plasmaConcentration + value, 0);
    var avg = sum / plasmaConcentration.length;

    document.getElementById('avgConc').innerText = avg.toFixed(2);

    if (peakConcentration.length === 0) avg = 0; // Handle empty array case

    var sum = peakConcentration.reduce((peakConcentration, value) => peakConcentration + value, 0);
    var avgPeak = sum / peakConcentration.length; 
    
    document.getElementById('avgPeakConc').innerText = avgPeak.toFixed(2);

    gen = gen / (24*60)

    var effClearAvg = gen / avg * 100;
    var effClearPeak = gen / avgPeak * 100;

    document.getElementById('effClearAvgConc').innerText = effClearAvg.toFixed(2);
    document.getElementById('effClearPeakConc').innerText = effClearPeak.toFixed(2);


    if (volumeofDistribution.length === 0) avg = 0; // Handle empty array case

    var sum = volumeofDistribution.reduce((volumeofDistribution, value) => volumeofDistribution + value, 0);
    var avgVol = sum / volumeofDistribution.length; 

    document.getElementById('avgVolume').innerText = avgVol.toFixed(2);

}


function updateGraphVar(plasmaConcentration, volumeofDistribution, dialysateConcentration, volDialysate){
    var selectedVar = document.querySelector('input[name="variable"]:checked').value;
    var zoom = document.querySelector('input[name="zoom"]:checked').value;
    var average = document.querySelector('input[name="add"]:checked').value;

    if (zoom === "Zoomed In"){
        zoom = 'auto';
    }
    else if (zoom === "Zoomed Out"){
        zoom = 0;
    }

    if (average === "Add Avg"){
        avg = true
    }
    else if (average === "No Avg"){
        avg = false
    }

    if (selectedVar === "Plasma Concentration"){
        renderChart(plasmaConcentration, "Plasma Concentration (mg/L)", zoom, avg)
    }
    else if (selectedVar === "Volume of Distribution"){
        renderChart(volumeofDistribution, "Volume of Distribution (L)", zoom, avg)
    }
    else if (selectedVar === "Dialysate Concentration"){
        renderChart(dialysateConcentration, "Dialysate Concentration (mg/L)", zoom, avg)
    }

    else if (selectedVar === "Dialysate Volume"){
        renderChart(volDialysate, "Dialysate Volume (mL)", zoom, avg)
    }
}