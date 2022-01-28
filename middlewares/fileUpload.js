const multer = require('multer')

const storage = multer.diskStorage ({
    destination: function(request, file, callback) {
        callback(null, "uploads")
    },
    filename: function(request, file, callback) {
        callback(null, Date.now() + '-' + file.originalname)
    }
})

const upload = multer ({storage})
    
module.exports = upload

// FUNCTION FULL TIME
// function getFullTime(time) {
//     let month = ["Januari", "Febuari", "Maret", "April", "Mei", "Juni", "Juli", "September", "Oktober", "November", "Desember"];
    
//     let date = time.getDate()
//     let i = time.getMonth()
//     let year = time.getFullYear()
//     let hours = time.getHours()
//     let minutes = time.getMinutes()
//     let fullTime = `${date} ${month[i]} ${year} ${hours}:${minutes} WIB`    

//     return fullTime;
// }
// FUNCTION DISTANCE
// function getDistanceTime(time) {
//     let timePost = time;
//     let timeNow = new Date();
//     let distance = timeNow - timePost;

//     // CONVERT TO DAY
//     let milisecond = 1000; // dalam 1 detik = 1000 detik
//     let secondInHours = 3600; // dalam 1 jam (berapa detik 60*60) = 3600 detik
//     let hourseInDay = 23 // dalam 1 hari (berapa jam) = 23 jam (hitungan default)
//     let second = 60; // dalam 1 detik
//     let minutes = 60; // dalam 1 menit = 60 detik

//     let distanceDay = distance / (milisecond * secondInHours * hourseInDay);
//     let distanceHours = Math.floor(distance / (milisecond * second * minutes));
//     let distanceMinutes = Math.floor(distance / (milisecond * second));
//     let distanceSecond = Math.floor(distance / (milisecond - second));
//     distanceDay = Math.floor(distanceDay);

//     // CONDITION HARI
//     if (distanceDay >= 1) {
//         return `${distanceDay} day ago`;
//     } else {

//         // CONDITION JAM
//         if (distanceHours >= 1) {
//             return `${distanceHours} hours ago`;
//         } else {

//             // CONDITION MENIT
//             if (distanceMinutes >= 1) {
//                 return `${distanceMinutes} minutes ago`;

//                 // CONDITION DETIK
//             } else {
//                 return `${distanceSecond} second ago`;
//             }
//         }
//     } 
// }