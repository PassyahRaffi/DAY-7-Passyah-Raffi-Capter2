let blogs = [];

function addBlog(event) {

    event.preventDefault();

    let title = document.getElementById("input-blog-title").value;
    let content = document.getElementById("input-blog-content").value;
    let image = document.getElementById("input-blog-image").files;

    image = URL.createObjectURL(image[0]);

    let blog = {
        title: title,
        content: content,
        image: image,
        author: "Muhammad Passyah Abdul Raffi",
        postAt: new Date()
    }

    blogs.push(blog);
    console.log(blogs);

    renderBlog()
  }
  
// MANIPULATION HTML / DOM
function renderBlog() {
    let contentContainer = document.getElementById("contents");

    contentContainer.innerHTML = firstBlogContent();

    for (let i = 0; i < blogs.length; i++) {
        contentContainer.innerHTML += /* html */`<div id="contents" class="blog-list">
        <!-- dynamic content would be here -->
        <div class="blog-list-item">
          <div class="blog-image">
            <img src="${blogs[i].image}" alt="" />
          </div>
          <div class="blog-content">
            <div class="btn-group">
              <button class="btn-edit">Edit Post</button>
              <button class="btn-post">Post Blog</button>
            </div>
            <h1>
              <a href="blog-detail.html" target="_blank"
                >${blogs[i].title}</a
              >
            </h1>
            <div class="detail-blog-content">
              ${getFullTime(blogs[i].postAt)} | ${blogs[i].author}
            </div>
            <p>
              ${blogs[i].content}
            </p>
            <br>
            <div style="text-align: left; font-weight: bold;">
              <span style="font-size: 13px; color: grey;">
              ${getDistanceTime(blogs[i].postAt)}
              </span>
          </div>
          </div>
        </div>
      </div>`
    }
}

function firstBlogContent() {
  return /* html */`<div class="blog-list-item">
           <div class="blog-image">
             <img src="assets/blog-img.png" alt="" />
           </div>
           <div class="blog-content">
               <div class="btn-group">
                 <button class="btn-edit">Edit Post</button>
                 <button class="btn-post">Post Blog</button>
               </div>
               <h1>
                 <a href="blog-detail.html" target="_blank"
                 >Pasar Coding di Indonesia Dinilai Masih Menjanjikan</a>
               </h1>
               <div class="detail-blog-content">
               12 Juli 2021 22:30 WIB | Ichsan Emrald Alamsyah
               </div>
               <p>
               Ketimpangan sumber daya manusia (SDM) di sektor digital masih
               menjadi isu yang belum terpecahkan. Berdasarkan penelitian
               ManpowerGroup, ketimpangan SDM global, termasuk Indonesia,
               meningkat dua kali lipat dalam satu dekade terakhir. Lorem ipsum,
               dolor sit amet consectetur adipisicing elit. Quam, molestiae
               numquam! Deleniti maiores expedita eaque deserunt quaerat! Dicta,
               eligendi debitis?
               </p>
              <br>
              <div style="text-align: left; font-weight: bold;">
              <span style="font-size: 13px; color: grey;">
                1 day ago
              </span>
            </div>
         </div>
     </div>`
 }

// console.log(waktu.getDate()); // tanggal
// console.log(waktu.getMonth()); // bulan dalam bentuk index 0 artinya januari, 1 artinya febuari
// console.log(waktu.getFullYear()); // tahun
// console.log(waktu.getHours()); // jam
// console.log(waktu.getMinutes()); // menit

let month = ["Januari", "Febuari", "Maret", "April", "Mei", "Juni", "Juli", "September", "Oktober", "November", "Desember"];

function getFullTime(time) {

  let date = time.getDate()

  let i = time.getMonth()

  let year = time.getFullYear()

  let hours = time.getHours()

  let minutes = time.getMinutes()

  let fullTime = `${date} ${month[i]} ${year} ${hours}:${minutes} WIB`
  
  return fullTime;
}

function getDistanceTime(time) {
  
  let timePost = time;

  let timeNow = new Date();

  let distance = timeNow - timePost; // result milisecond
  // 1 second = 1000 miliscond

  // CONVERT TO DAY
  let milisecond = 1000; // dalam 1 detik = 1000 detik
  let secondInHours = 3600; // dalam 1 jam (berapa detik 60*60) = 3600 detik
  let hourseInDay = 23 // dalam 1 hari (berapa jam) = 23 jam (hitungan default)
  let second = 60; // dalam 1 detik
  let minutes = 60; // dalam 1 menit = 60 detik

  let distanceDay = distance / (milisecond * secondInHours * hourseInDay);

  let distanceHours = Math.floor(distance / (milisecond * second * minutes));
  
  let distanceMinutes = Math.floor(distance / (milisecond * second));
  
  let distanceSecond = Math.floor(distance / (milisecond - second));
  
  distanceDay = Math.floor(distanceDay);

  // CONDITION HARI
  if (distanceDay >= 1) {
    return `${distanceDay} day ago`;
  } else {

    // CONDITION JAM
    if (distanceHours >= 1) {
      return `${distanceHours} hours ago`;
    } else {
      
      // CONDITION MENIT
      if (distanceMinutes >= 1) {
        return `${distanceMinutes} minutes ago`;
        
        // CONDITION DETIK
      } else {
        return `${distanceSecond} second ago`;
      }
    }
  } 
}

setInterval ( () => {
  renderBlog()
}, 3000);