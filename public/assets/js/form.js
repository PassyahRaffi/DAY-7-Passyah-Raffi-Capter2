function submitData() {
    
    let name = document.getElementById('inputName').value;
    let email = document.getElementById('inputEmail').value;
    let phone = document.getElementById('inputPhone').value;
    let subject = document.getElementById('subject').value;
    let message = document.getElementById('inputMessage').value;

    // CARA 2
    // variabel untuk menampung tag checkbox yang di ceklis
    let skillHtml =  document.getElementById('html').checked;
    let skillCss =  document.getElementById('css').checked;
    let skillJs = document.getElementById('js').checked;

    // CONDITION SKILL HTML!
    // JIKA USER TIDAK MENGISI CHECKBOX!
        if (skillHtml) {
            skillHtml = (document.getElementById('html').value);
        } else {
            skillHtml = "";
            // artinya user tidak ceklis checkbox!
        } 
    // CONDITION SKILL CSS!
    // JIKA USER TIDAK MENGISI CHECKBOX!
        if (skillCss) {
            skillCss = (document.getElementById('css').value);
        } else {
            skillCss = "";
            // artinya user tidak ceklis checkbox!
        }
    // CONDITION SKILL JS!
    // JIKA USER TIDAK MENGISI CHECKBOX!
        if (skillJs) {
            skillJs = (document.getElementById('js').value);
        } else {
            skillJs = "";
            // artinya user tidak ceklis checkbox!
        }

    // CONDITION PESAN ALERT!
    if (name == "") {
        return alert("Name is required");
    } else if (email == "") {
        return alert("Email is required");
    } else if (phone == "") {
        return alert("Phone is required");
    } else if (subject == "Select Here") {
        return alert("Subject is required");
    } else if (message == "") {
        return alert("Message is required");
    } else {
        
        let emailReceiver = 'passyah11@gmail.com';
        let a = document.createElement('a')
        
        a.href = `mailto:${emailReceiver}?subject=${subject}&body=Hallo my name ${name}, ${message}, contact me ${phone}%0Asend CV ${email} requirment skill${skillHtml}${skillCss}${skillJs}`
        a.click();
        
        let dataObject = {
            name: name,
            email: email,
            phoneNumber: phone,
            subject: subject,
            message: message,
            skillHtml: skillHtml,
            skillCss: skillCss,
            skillJs: skillJs
        }
        console.log(dataObject);
    }        
}