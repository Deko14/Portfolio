(function() {
    // https://dashboard.emailjs.com/admin/integration
    emailjs.init('user_g74bi9lDujFKpYg7ECOrA');
})();

window.onload = function() {
    document.getElementById('appointment_form').addEventListener('submit', function(event) {
        event.preventDefault();
        // generate a five digit number for the contact_number variable
        this.appointment_number.value = Math.random() * 100000 | 0;
        // these IDs from the previous steps
        emailjs.sendForm('dento_medical', 'appointment_form', this)
            .then(function() {
                console.log('SUCCESS!');
                alert("Ви благодариме за испратената порака, ќе ви одговориме во најкраток можен рок.")
            }, function(error) {
                console.log('FAILED...', error);
            });
    });
}
