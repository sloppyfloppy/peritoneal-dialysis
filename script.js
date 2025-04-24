const treatments = {
    treatment1: null,
    treatment2: null
};

const savedInputs = {
    treatment1: null,
    treatment2: null
  };
  

function setupEventListeners() {
    // Attach change event to all solute radio buttons
    document.querySelectorAll('input[name="solute"]').forEach(radio => {
      radio.addEventListener('change', populateSoluteValues);
    });

    document.getElementById('weight').addEventListener('input', populateSoluteValues);
    document.getElementById('height').addEventListener('input', populateSoluteValues);
    document.getElementById('sex').addEventListener('change', populateSoluteValues);

    document.getElementById('run-tx1').addEventListener('click', () => {
        if (!validateForm()) return;
        handleTreatmentToggle('treatment1');
    });
      
    document.getElementById('run-tx2').addEventListener('click', () => {
        if (!validateForm()) return;
        handleTreatmentToggle('treatment2');
    });

    document
    .querySelectorAll('#series-selector input[type=checkbox]')
    .forEach(cb => {
        cb.addEventListener('change', () => {
        // optional: you could re-validate inputs here
        redrawBothLines();
        });
    });

    [
        'variable',   // Plasma / Volume / Dialysate conc / Dialysate volume
        'zoom',       // Zoomed In / Zoomed Out
        'add'         // Include Avg / Exclude
      ].forEach(name => {
        document
          .querySelectorAll(`input[name="${name}"]`)
          .forEach(radio => radio.addEventListener('change', redrawBothLines));
      });
    
    document
    .querySelectorAll('input[name="displayTreatmentInfo"]')
    .forEach(radio => radio.addEventListener('change', () => {
        const key = radio.value;         // "treatment1" or "treatment2"
        const snap = savedInputs[key];     // the object you saved
        console.log(snap);
        if (!snap) return;                 // nothing to show yet
        // call your existing function:
        displayValues(
            snap.age,
            snap.weight,
            snap.height,
            snap.sex,
            snap.volume,
            snap.volumeData,
            snap.timeData,
            snap.schemeData,
            snap.m_fluid_removal,
            snap.a_fluid_removal,
            snap.pna,
            snap.kru,
            snap.solute,
            snap.days
        );
    }));

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
  

function gatherFormInputs(){
    var age = parseFloat(document.getElementById('age').value);
    var height = parseFloat(document.getElementById('height').value);
    var weight = parseFloat(document.getElementById('weight').value);
    var sex = document.getElementById('sex').value;
    console.log("Sex", sex);
    var kru = parseFloat(document.getElementById('kru').value);
    var solute = document.querySelector('input[name="solute"]:checked').value
    var mtac = parseFloat(document.getElementById('mtac').value);
    var volume = parseFloat(document.getElementById('volume').value);
    var pna = parseFloat(document.getElementById('pna').value);

    var m_fluid_removal = parseFloat(document.getElementById('m_fluid_removal').value);
    var a_fluid_removal = parseFloat(document.getElementById('a_fluid_removal').value);

    var days = Array.from(
        document.querySelectorAll('input[name="day"]:checked')
      ).map(chk => chk.value);
      

    var volumeData = [];
    var timeData = [];
    var schemeData = [];
    var totATime = 0;
    var totMTime = 0;
    var deadTime = 0.25; //hours
    var totalExchangeTime = 0;

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
                volumeData.push(volumeValue * 1000); // Push the float value into the volumeData array
            }
        }

        var currentId = 'exTime ' + i;
        var element = document.getElementById(currentId);

        // Check if the element exists
        if (element) {
            timeValue = parseFloat(element.value);
            // Parse the element's text content into a float value and push it into the volumeData array
            // Check if the parsed value is a valid float
            if (timeValue != 0 && !isNaN(timeValue)){ // If it's a valid float
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
                totalExchangeTime += timeValue; 
            }
            if (schemeValue == "A"){
                totATime = totATime + timeValue - deadTime;
            }
            else if (schemeValue == "M"){
                totMTime = totMTime + timeValue - deadTime;
            }
        }
    }
    return {kru, solute, mtac, volume, pna, m_fluid_removal, a_fluid_removal, volumeData, timeData, schemeData, days, totATime, totMTime, totalExchangeTime, age, height, weight, sex};
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
    if (total <= 0){
        errorMessage.textContent = "Please make sure to input some exchange";
    }

    if (!hasErrors){
        return true;
    }
    return false;
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

    var days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
      

    volumeData = [2, 2, 2, 2];
    timeData = [2.25, 2.25, 2.25, 12.25];
    schemeData = ["A", "A", "A", "M"];

    var m_fluid_removal = 200;
    var a_fluid_removal = 800;
    var pna = 78;
    var kru = 2;

    
    var selectedSolute = "urea";

    displayValues(age, weight, height, sex, volume, volumeData, timeData, schemeData, m_fluid_removal, a_fluid_removal, pna, kru, selectedSolute, days);

}


function displayValues(age, weight, height, sex, volume, volumeData, timeData, schemeData, m_fluid_removal, a_fluid_removal, pna, kru, solute, days){
    document.getElementById('volume').value = volume;
    document.getElementById('age').value = age;
    document.getElementById('weight').value = weight;
    document.getElementById('height').value = height;
    document.getElementById('sex').value = sex;
    document.getElementById('m_fluid_removal').value = m_fluid_removal;
    document.getElementById('a_fluid_removal').value = a_fluid_removal;
    document.getElementById('pna').value = pna;
    document.getElementById('kru').value = kru;
    
    // Set default values for volumeData, timeData, and schemeData
    for (var i = 0; i < volumeData.length; i++) {
        document.getElementById('exVolume ' + (i + 1)).value = volumeData[i];
        document.getElementById('exTime ' + (i + 1)).value = timeData[i];
        document.getElementById('exScheme ' + (i + 1)).value = schemeData[i];
    }  

    document.querySelectorAll('input[name="day"]').forEach(chk => {
        chk.checked = days.includes(chk.value);
    });
    
    const defaultSolute = document.querySelector('input[name="solute"][value="' + solute + '"]');
    if (defaultSolute) {
        defaultSolute.checked = true;
        populateSoluteValues();
    }

}


function pdCalculator(kru, solute, mtac, volume, pna, m_fluid_removal, a_fluid_removal, volumeData, timeData, schemeData, days, totATime, totMTime, totalExchangeTime){
    
    if (solute == "urea"){
        kru = kru / 1.08;
    }
    else if (solute == "creatinine"){
        kru = kru * 2 / 1.08;
    }
    
    var gen = ((pna - 7.17)/8.68 * 1000) / 1440; // tentative formula to get gen per minute

    var numExchange = volumeData.length;
    var numOfTreatment = days.length;
    
    var deadTime = 0.25; // dead time = 15 minutes
    var deadVolumeDialysate = 150; // dead volume dialysate = 150 mL

    let plasmaConcentration = new Array(7 * 24 * 60).fill(0);
    let peakConcentration = new Array(numExchange * numOfTreatment).fill(0);
    let dialysateConcentration = new Array(7 * 24 * 60).fill(0);
    let volumeofDistribution = new Array(7 * 24 * 60).fill(0);
    let volDialysate = new Array(7 * 24 * 60).fill(0);
    let amountDialysate = new Array(7 * 24 * 60).fill(0);
    let plasmaToDialysate = new Array(7 * 24 * 60).fill(0);
    let plasmaToDialysateDiffusion = new Array(7 * 24 * 60).fill(0);
    let plasmaToDialysateConvection = new Array(7 * 24 * 60).fill(0);
    let amountBody = new Array(7 * 24 * 60).fill(0);
    let netMovtIn = new Array(7 * 24 * 60).fill(0);
    let excretion = new Array(7 * 24 * 60).fill(0);
    let coverbar = new Array(7 * 24 * 60).fill(0);

    let initial_equilibrium_tolerance = 0.001;
    let initial_steady_state = 0;
    let initial_Concentration = 1;
    let t = 0;
    let peak_index = 0;

    var totalAEffectiveTime = 0;
    var totalMEffectiveTime = 0;

    for (let k = 0; k < numExchange; k ++){
        if(schemeData[k] == "M"){
            totalMEffectiveTime += timeData[k] - deadTime;
        }
        else if (schemeData[k] == "A"){
            totalAEffectiveTime += timeData[k] - deadTime;
        }
    }

    var volume_intake = (m_fluid_removal + a_fluid_removal)/1440;
    var fluidARemovalRate = a_fluid_removal/(totalAEffectiveTime * 60);
    var fluidMRemovalRate = m_fluid_removal/(totalMEffectiveTime * 60);

    var beta = 0;
    var uf = 0;
    var f = 0;
    
    var daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    
    const max_iter = 1000;
    let iterCount = 0;
    mtac = 19.09;
    while (initial_steady_state == 0 && iterCount++ < max_iter) {
        for (let day = 0; day < 7; day++) {
            if (days.includes(daysOfWeek[day])) {
                for (let exchange = 0; exchange < numExchange; exchange++){
                    if (schemeData[exchange] == "M"){
                        uf = fluidMRemovalRate;
                    }
                    else{
                        uf = fluidARemovalRate;
                    }
                    beta = uf / mtac;
                    f = (1 / beta) - (1 / (Math.exp(beta) - 1));

                    var effectiveTime = (timeData[exchange] - deadTime) * 60;
                    var totalTime = timeData[exchange] * 60;
                    initialTime = t;

                    // start of a day
                    if (t == 0){
                        plasmaConcentration[t] = initial_Concentration;
                        volumeofDistribution[t] = volume;
                        volDialysate[t] = deadVolumeDialysate + volumeData[exchange];
                        amountDialysate[t] = deadVolumeDialysate / 100 * plasmaConcentration[t];
                        amountBody[t] = plasmaConcentration[t] * volume * 10;
                        dialysateConcentration[t] = amountDialysate[t] / volDialysate[t] * 100;
                        plasmaToDialysateDiffusion[t] = (plasmaConcentration[t] - dialysateConcentration[t])* mtac / 100;
                        plasmaToDialysateConvection[t] = (plasmaConcentration[t] - f * (plasmaConcentration[t] - dialysateConcentration[t])) * uf / 100;
                        plasmaToDialysate[t] = plasmaToDialysateDiffusion[t] + plasmaToDialysateConvection[t];
                        excretion[t] = plasmaConcentration[t] * kru / 100;
                        netMovtIn[t] = gen - excretion[t] - plasmaToDialysate[t];

                        peakConcentration[peak_index] = plasmaConcentration[t];
                        peak_index += 1;

                        t += 1;
                    }

                    // reset from dead time
                    else{
                        volumeofDistribution[t] = volumeofDistribution[t - 1] + (volume_intake - uf)/1000;
                        volDialysate[t] = deadVolumeDialysate + volumeData[exchange];
                        amountDialysate[t] = amountDialysate[t - 1] + plasmaToDialysate[t - 1];
                        plasmaConcentration[t] = ((plasmaConcentration[t - 1] * 10 * volumeofDistribution[t-1]) + netMovtIn[t - 1])/(volumeofDistribution[t] * 10);
                        dialysateConcentration[t] = amountDialysate[t] / volDialysate[t] * 100;
                        plasmaToDialysateDiffusion[t] = (plasmaConcentration[t] - dialysateConcentration[t])* mtac / 100;
                        plasmaToDialysateConvection[t] = (plasmaConcentration[t] - f * (plasmaConcentration[t] - dialysateConcentration[t])) * uf / 100;
                        plasmaToDialysate[t] = plasmaToDialysateDiffusion[t] + plasmaToDialysateConvection[t];
                        amountBody[t] = amountBody[t - 1] * netMovtIn [t - 1];
                        excretion[t] = plasmaConcentration[t] * kru / 100;
                        netMovtIn[t] = gen - excretion[t] - plasmaToDialysate[t];

                        peakConcentration[peak_index] = plasmaConcentration[t - 1];
                        peak_index += 1;
                        t += 1;
                    }

                    // doing an exchange
                    while (t < (initialTime + effectiveTime)){
                        volumeofDistribution[t] = volumeofDistribution[t - 1] + (volume_intake - uf)/1000;
                        volDialysate[t] = volDialysate[t - 1] + uf;
                        amountDialysate[t] = amountDialysate[t - 1] + plasmaToDialysate[t - 1];
                        plasmaConcentration[t] = ((plasmaConcentration[t - 1] * 10 * volumeofDistribution[t-1]) + netMovtIn[t - 1])/(volumeofDistribution[t] * 10);
                        dialysateConcentration[t] = amountDialysate[t] / volDialysate[t] * 100;
                        plasmaToDialysateDiffusion[t] = (plasmaConcentration[t] - dialysateConcentration[t])* mtac / 100;
                        plasmaToDialysateConvection[t] = (plasmaConcentration[t] - f * (plasmaConcentration[t] - dialysateConcentration[t])) * uf / 100;
                        plasmaToDialysate[t] = plasmaToDialysateDiffusion[t] + plasmaToDialysateConvection[t];
                        amountBody[t] = amountBody[t - 1] * netMovtIn [t - 1];
                        excretion[t] = plasmaConcentration[t] * kru / 100;
                        netMovtIn[t] = gen - excretion[t] - plasmaToDialysate[t];

                        t += 1;
                    }

                    // during dead time 
                    while (t >= (initialTime + effectiveTime) && t < (initialTime + totalTime)){
                        plasmaToDialysateDiffusion[t] = 0;
                        plasmaToDialysateConvection[t] = 0;
                        plasmaToDialysate[t] = 0;
                        volDialysate[t] = deadVolumeDialysate;
                        dialysateConcentration[t] = dialysateConcentration[t - 1];
                        amountDialysate[t] = volDialysate[t - 1] * dialysateConcentration[t - 1] / 100;

                        volumeofDistribution[t] = volumeofDistribution[t - 1] + volume_intake/1000;
                        plasmaConcentration[t] = ((plasmaConcentration[t - 1] * 10 * volumeofDistribution[t-1]) + netMovtIn[t - 1])/(volumeofDistribution[t] * 10);
                        amountBody[t] = amountBody[t - 1] * netMovtIn [t - 1];
                        excretion[t] = plasmaConcentration[t] * kru / 100;
                        netMovtIn[t] = gen - excretion[t] - plasmaToDialysate[t];

                        t += 1;
                    }
                }
            }

            // let's say monday is not selected, need to initialize time stamp 0
            if (day == 0 && !days.includes(daysOfWeek[day])){
                plasmaConcentration[t] = initial_Concentration;
                volumeofDistribution[t] = volume;

                plasmaToDialysateDiffusion[t] = 0;
                plasmaToDialysateConvection[t] = 0;
                plasmaToDialysate[t] = 0;

                volDialysate[t] = deadVolumeDialysate;
                amountDialysate[t] = volDialysate[t] / 100 * plasmaConcentration[t];
                dialysateConcentration[t] = amountDialysate[t] / volDialysate[t] * 100;
        
                amountBody[t] = plasmaConcentration[t] * volume * 10;
                excretion[t] = plasmaConcentration[t] * kru / 100;
                netMovtIn[t] = gen - excretion[t] - plasmaToDialysate[t];

                t += 1;
            }

            while (t < (day + 1) * (24 * 60)){
                plasmaToDialysateDiffusion[t] = 0;
                plasmaToDialysateConvection[t] = 0;
                plasmaToDialysate[t] = 0;
                volDialysate[t] = deadVolumeDialysate;
                dialysateConcentration[t] = dialysateConcentration[t - 1];
                amountDialysate[t] = volDialysate[t - 1] * dialysateConcentration[t - 1] / 100;

                volumeofDistribution[t] = volumeofDistribution[t - 1] + volume_intake/1000;
                plasmaConcentration[t] = ((plasmaConcentration[t - 1] * 10 * volumeofDistribution[t-1]) + netMovtIn[t - 1])/(volumeofDistribution[t] * 10);
                amountBody[t] = amountBody[t - 1] * netMovtIn [t - 1];
                excretion[t] = plasmaConcentration[t] * kru / 100;
                netMovtIn[t] = gen - excretion[t] - plasmaToDialysate[t];

                t += 1;
            }

        }

        if (Math.abs(plasmaConcentration[t - 1] - initial_Concentration) < (initial_equilibrium_tolerance * initial_Concentration)){
            initial_steady_state = 1;
        }
        else{
            initial_Concentration = plasmaConcentration[t - 1];
            t = 0;
            peak_index = 0;
        }
    } 

    if (iterCount >= max_iter) {
        console.warn("pdCalculator: reached maximum iterations without converging");
    }
   
    return {
        plasmaConcentration,
        volumeofDistribution,
        peakConcentration,
        dialysateConcentration,
        volDialysate,
        gen
    };
                      
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

    console.log(gen);
    console.log(avg);

    var effClearAvg = gen / avg * 100;
    var effClearPeak = gen / avgPeak * 100;

    document.getElementById('effClearAvgConc').innerText = effClearAvg.toFixed(2);
    document.getElementById('effClearPeakConc').innerText = effClearPeak.toFixed(2);


    if (volumeofDistribution.length === 0) avg = 0; // Handle empty array case

    var sum = volumeofDistribution.reduce((volumeofDistribution, value) => volumeofDistribution + value, 0);
    var avgVol = sum / volumeofDistribution.length; 

    document.getElementById('avgVolume').innerText = avgVol.toFixed(2);

}

function redrawBothLines() {
    console.log("→ treatments:", treatments);
    const selectedVar = document.querySelector('input[name="variable"]:checked').value;
    const zoomRadio   = document.querySelector('input[name="zoom"]:checked').value;
    const avgRadio    = document.querySelector('input[name="add"]:checked').value;
  
    const zoomVal = zoomRadio === "Zoomed Out" ? 0 : 'auto';
    const showAvg = avgRadio === "Add Avg";
  
    let array1, array2, yLabel;
    switch (selectedVar) {
      case "Plasma Concentration":
        array1 = treatments.treatment1?.plasmaConcentration;
        array2 = treatments.treatment2?.plasmaConcentration;
        yLabel = "Plasma Concentration (mg/L)";
        break;
      case "Volume of Distribution":
        array1 = treatments.treatment1?.volumeofDistribution;
        array2 = treatments.treatment2?.volumeofDistribution;
        yLabel = "Volume of Distribution (L)";
        break;
      case "Dialysate Concentration":
        array1 = treatments.treatment1?.dialysateConcentration;
        array2 = treatments.treatment2?.dialysateConcentration;
        yLabel = "Dialysate Concentration (mg/L)";
        break;
      case "Dialysate Volume":
        array1 = treatments.treatment1?.volDialysate;
        array2 = treatments.treatment2?.volDialysate;
        yLabel = "Dialysate Volume (mL)";
        break;
      default:
        return; // no-op if somehow nothing matches
    }
  
    const datasets = [];
  
    function pushSeries(key, dataArr, label, color, colorAverage) {
        // find the corresponding checkbox
        const box = document.querySelector(
          `#series-selector input[data-series="${key}"]`
        );
        if (!box.checked || !Array.isArray(dataArr) || dataArr.length === 0) return;
      
        // main line
        datasets.push({
          label,
          data: dataArr.map((y,i) => ({ x: i, y })),
          borderColor: color,
          fill: false
        });
      
        // dotted average
        if (showAvg) {
          const avg = dataArr.reduce((s,v)=>s+v,0)/dataArr.length;
          datasets.push({
            label: label + ' Avg',
            data: dataArr.map((_,i)=>({ x: i, y: avg })),
            borderDash: [2,2],
            borderWidth: 1,
            borderColor: colorAverage,
            fill: false
          });
        }
      }
      
  
    pushSeries("treatment1", array1, "Treatment 1", "#2A9D8F", "#6D454C");
    pushSeries("treatment2", array2, "Treatment 2", "#E76F51", "#1C2541");
    
    console.log("datasets", datasets);
    const existing = Chart.getChart("chartCanvas");
    if (existing) existing.destroy();
  
    const ctx = document.getElementById('chartCanvas').getContext('2d');
    new Chart(ctx, {
      type: 'line',
      data: { datasets },
      options: {
        scales: {
          x: {
            type: 'linear',
            title: { display: true, text: 'Time (minutes)' },
            min: 0,
            max: 10080,
            ticks: { stepSize: 1000 }
          },
          y: {
            title: { display: true, text: yLabel },
            min: zoomVal
          }
        },
        plugins: {
          legend: {
            labels: {
              font: { family: 'Manrope', size: 15 }
            }
          }
        }
      }
    });
  }

async function handleTreatmentToggle(seriesKey) {
    const cb = document.getElementById(seriesKey);

    const inputs = gatherFormInputs();
    savedInputs[seriesKey] = { ...inputs};
    
    const {
        plasmaConcentration,
        volumeofDistribution,
        peakConcentration,         // you can omit this if you never plot peaks
        dialysateConcentration,
        volDialysate,
        gen                        // if you need ‘gen’ for numerical results
      } = await pdCalculator(
        inputs.kru,
        inputs.solute,
        inputs.mtac,
        inputs.volume,
        inputs.pna,
        inputs.m_fluid_removal,
        inputs.a_fluid_removal,
        inputs.volumeData,
        inputs.timeData,
        inputs.schemeData,
        inputs.days,
        inputs.totATime,
        inputs.totMTime,
        inputs.totalExchangeTime    // make sure gatherFormInputs returns this too
      );
    

    treatments[seriesKey] = {
        plasmaConcentration,
        volumeofDistribution,
        dialysateConcentration,
        volDialysate
    };
    
    console.log("TREATMENTS")
    console.log(treatments);    
    // 2) redraw chart with everything in `treatments`
    redrawBothLines();
    updateNumerical(plasmaConcentration, peakConcentration, gen, volumeofDistribution);
}