const key = 'AIzaSyDQkm2ghQWWQcfakiiOZ8FKi6zI6mPN2bQ';
const playlistId = 'PLDvqPFxc26d8pJsY_OfSTy9bRVfWT0bj6';
let URL = 'https://www.googleapis.com/youtube/v3/playlistItems';

const options = {
  playlistId: playlistId,
  maxResults: 20,
  key: key,
  part: 'snippet'
};

const loadMainVideos = () => {

    URL += '?' + Object.keys(options).map((k) => k + '=' + encodeURIComponent(options[k])).join('&');

    fetch(URL)
      .then(res => res.json())
      .then(data => {
        console.log(data);
        let prevBtn = document.getElementById('prevBtn');
        let nextBtn = document.getElementById('nextBtn');
        let videoCounter = 0;
        let videosArray = data.items;
        let id = data.items[videoCounter].snippet.resourceId.videoId;
        document.getElementById('video-slide').innerHTML = `<iframe width="1280" height="720" src="https://www.youtube.com/embed/${id}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;

        if(videoCounter == 0){
          prevBtn.style.display = "none";
        }

        nextBtn.addEventListener("click", (event) => {
          videoCounter++;
          if(videoCounter == videosArray.length - 1){
            nextBtn.style.display = "none";
          }
          prevBtn.style.display = "inline-block";
          id = data.items[videoCounter].snippet.resourceId.videoId;
          document.getElementById('video-slide').innerHTML = `<iframe width="1280" height="720" src="https://www.youtube.com/embed/${id}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;         
        });

        prevBtn.addEventListener("click", (event) => {
          videoCounter--;
          if(videoCounter == 0){
            prevBtn.style.display = "none";
          }
          nextBtn.style.display = "inline-block";
          id = data.items[videoCounter].snippet.resourceId.videoId;
          document.getElementById('video-slide').innerHTML = `<iframe width="1280" height="720" src="https://www.youtube.com/embed/${id}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;         
        });

      }) 
      .catch(err => console.log(err));
}

loadMainVideos();

