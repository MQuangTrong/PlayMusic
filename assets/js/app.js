/**
         * 1. Render songs
         * 2. Scroll top
         * 3. Play / pause / seek
         * 3. CD rorate  quay
         * 3. Next / prev
         * 6. Random
         * 7. Next / Repeat when ended
         * 8. Active song
         * 9. Scroll active song into view
         * 10. Play song when click
         */

        // 1. Hạn chế tối đa các bài hát bị lặp lại
        // 2. Fix lỗi khi tua bài hát, click giữ một chút sẽ thấy lỗi, vì event updatetime nó liên tục chạy dẫn tới lỗi
        // 3. Fix lỗi khi next tới 1-3 bài đầu danh sách thì không “scroll into view”
        // 4. Lưu lại vị trí bài hát đang nghe, F5 lại ứng dụng không bị quay trở về bài đầu tiên
        // 5. Thêm chức năng điều chỉnh âm lượng, lưu vị trí âm lượng người dùng đã chọn. Mặc định 100%

        const $ = document.querySelector.bind(document);
        const $$ = document.querySelectorAll.bind(document);

        const PLAYER_STORAGE_KEY = 'F8_PLAYER_1'

        const player = $('.player')
        const heading = $('header h2');
        const cdThumb = $('.cd-thumb');
        const audio = $('#audio');
        const cd = $('.cd');
        const playBtn = $('.btn-toggle-play');
        const volume = $('.volume')
        const progressVolume = $('#progress-volume');
        const volumeBtnHight = $('.btn-volume-hight');

        const volumeBtnMute = $('.btn-volume-mute');
        const progress = $('#progress');
        const prevBtn = $('.btn-prev');
        const nextBtn = $('.btn-next');
        const randomBtn = $('.btn-random');
        const repeatBtn = $('.btn-repeat');
        const playlist = $('.playlist')
        const timeStart = $('.time .time-start');
        const timeEnd = $('.time .time-end');

        let songPlayed = [0];

        const app = {
            currentIndex: 0,
            isPlaying: false,
            isRandom: false,
            isRepeat: false,
            isDraggingProcess: true,


            //cài đặt cấu hình lưu các mấy cái nút randon, repeat
            //mặc định không có lấy object
            config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
            setConfig: function (key, value) {
                this.config[key] = value;
                localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
            },

            songs: [
                {
                    name: "Summertime",
                    singer: "Cinnamons x Evening Cinema",
                    path: "./assets/music/summertime.mp3",
                    image: "https://i.ytimg.com/vi/7y375DSyNPg/maxresdefault.jpg"
                },
                {
                    name: "Việt Nam những chuyến đi",
                    singer: "Vicky Nhung",
                    path: "./assets/music/vicky_nhung_viet_nam_nhung_chuyen_di_official_mv_vi_cuoc_doi_la_nhung_chuyen_di_2660905432055250184.mp3",
                    image: "https://yt3.googleusercontent.com/JX8bdOjXgIqfiFfKkfGLJ8l2G7o5NDcrtxihn9IL_pVo5IkCpGP0r2dtWMHFEhRb2AB92cMvjg=s176-c-k-c0x00ffffff-no-rj"
                },
                {
                    name: "Ánh nắng của anh",
                    singer: "Đức Phúc",
                    path: "./assets/music/Anh-Nang-Cua-Anh-Cho-Em-Den-Ngay-Mai-OST-Duc-Phuc.mp3",
                    image: "https://yt3.googleusercontent.com/uNtMsEqpSKHEdN7PXmGL5BO1FlYXtv10Rln9XO7bEwKkH86Jd4djv6s5JeWT9GYbpnLZU0AB=s176-c-k-c0x00ffffff-no-rj"
                },
                {
                    name: "Bật tình yêu lên",
                    singer: "Hoà Minzy x Tăng Duy Tân",
                    path: "./assets/music/BatTinhYeuLen-TangDuyTanHoaMinzy-8715666.mp3",
                    image: "https://yt3.googleusercontent.com/Qv2BxjV2b7pfOsK0GTgfktNER8C7zLB8wPOHeIuAQu_gmFwA9gsmCPzVtYJr671ogNMjUNIVqA=s176-c-k-c0x00ffffff-no-rj"
                },
                {
                    name: "Save me",
                    singer: "DEAMN",
                    path: "./assets/music/deamn_save_me_audio_6700488267465044191.mp3",
                    image: "https://yt3.ggpht.com/RKzUXP4BjdgEp2deVemmqQOZbfhzXblbB97yPF5EhjUUh5qO5No1Bf1sbot6cDB5p23p6v7bpg=s88-c-k-c0x00ffffff-no-rj"
                },
                {
                    name: "Đi để trở về",
                    singer: "Soobin Hoàng Sơn x Biti's Hunter",
                    path: "./assets/music/DiDeTroVe-SoobinHoangSon-4726882.mp3",
                    image: "https://yt3.googleusercontent.com/qOTJOcFSE9u0mtQDeIcLhdRjfdHFNjRmBYur8v_Zz_o-ipw_sBIMX2kewnptGeSw2LMN-R0Ndw=s176-c-k-c0x00ffffff-no-rj"
                },
                {
                    name: "Em đồng ý",
                    singer: "Đức phúc x 911 x Khắc Hưng",
                    path:
                        "./assets/music/EM ĐỒNG Ý (I DO) - ĐỨC PHÚC x 911 x KHẮC HƯNG - OFFICIAL MUSIC VIDEO - VALENTINE 2023.mp3",
                    image:
                        "https://lyricvn.com/wp-content/uploads/2023/02/c40dbb2a1bf4dfd1229b7bc29efebe4b.jpg"
                },
                {
                    name: "Hơn cả yêu",
                    singer: "Đức phúc",
                    path: "./assets/music/HƠN CẢ YÊU - ĐỨC PHÚC - OFFICIAL MUSIC VIDEO.mp3",
                    image: "https://photo-resize-zmp3.zmdcdn.me/w240_r1x1_jpeg/cover/a/9/e/d/a9ed142c215560ab45f6b2b433907f90.jpg"
                },
                {
                    name: "Là anh",
                    singer: "Phạm lịch",
                    path: "./assets/music/LaAnh-PhamLichBMZ-8811329.mp3",
                    image: "https://yt3.googleusercontent.com/fNFY01A9l82LJqr2EkWyHa7NhCmFeoBsllSp8FcxD8mrVxt05QOjAfonlvm3aQbLUftRkVUIQA=s176-c-k-c0x00ffffff-no-rj"
                },
                {
                    name: "Reality",
                    singer: "DeVy",
                    path: "./assets/music/reality_lost_frequencies_lyrics_vietsub_3767819450650469154.mp3",
                    image: "https://i.ytimg.com/vi/CtZIwUMOYyo/maxresdefault.jpg"
                },
                {
                    name: "That girl",
                    singer: "Siwonii Meow",
                    path: "./assets/music/vietsub_kara_that_girl_olly_murs_lyrics_tik_tok_5635169386843781489.mp3",
                    image: "https://yt3.ggpht.com/ytc/AGIKgqOLcP-v2vofPVI7fS82hlHDhVbjWkgOZCYB3aRuuQ=s68-c-k-c0x00ffffff-no-rj"
                }
            ],
            //hàm hiển thị ra màn hình
            render: function () {
                const htmls = this.songs.map((song, index) => {
                    return `
                <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                    <div class="thumb"
                        style="background-image: url('${song.image}')">
                    </div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            `
                })
                playlist.innerHTML = htmls.join('');
            },

            //hàm định nghĩa các thuộc tính
            defineProperties: function () {
                //định ngĩa 1 thuộc tính currentSong
                Object.defineProperty(this, 'currentSong', {
                    get: function () {
                        return this.songs[this.currentIndex];  //return this.currentSong;
                    } //dùng thì gọi app.currentSong là đc
                })
            },
            //hàm xử lí sự kiện
            handeleEvents: function () {
                const _this = this;
                const cdWidth = cd.offsetWidth;
                let currentVolume = 1;

                //Xử lý CD quay / dừng
                const cdThumbAnimate = cdThumb.animate([ //cdthum.animate trả về 1 đối tượng animate
                    { transform: 'rotate(360deg)' } //thuộc tính CSS quay: tranform
                ], {
                    //thể hiện quay như thế nào
                    duration: 10000, // quay trong 10 giây
                    iterations: Infinity //lặp vô hạn
                })

                cdThumbAnimate.pause() // mới vô cho nó dừng

                //Xử lý phóng to / thu nhỏ CD
                document.onscroll = function () {
                    const scrollTop = window.scrollY || document.documentElement.scrollTop; //hoặc window.scrollY
                    const newCdWith = cdWidth - scrollTop;

                    //kéo nhanh quá newCdWith về âm nên check
                    //thay đổi kích thước CD
                    cd.style.width = newCdWith > 0 ? newCdWith + 'px' : 0;
                    cd.style.opacity = newCdWith / cdWidth

                    //thay đổi kích thước volume
                    volume.style.height = newCdWith > 0 ? 36 + 'px' : 0;
                    volume.style.opacity = newCdWith / cdWidth
                }

                //Xử lý khi click play
                playBtn.onclick = function () {
                    //Logic thôi chứ code xấu
                    // if(_this.isPlaying) {
                    //     _this.isPlaying = false;
                    //     audio.pause();
                    //     player.classList.remove('playing');
                    // } else {
                    //     _this.isPlaying = true;
                    //     audio.play();
                    //     player.classList.add('playing');
                    // }

                    if (_this.isPlaying) {
                        audio.pause();
                    } else {
                        audio.play();
                    }
                }

                //Khi bài hát được play thì lắng nghe sự kiện play
                audio.onplay = function () {
                    _this.isPlaying = true;
                    player.classList.add('playing');
                    cdThumbAnimate.play();


                }

                //Khi bài hát được pause thì lắng nghe sự kiện pause
                audio.onpause = function () {
                    _this.isPlaying = false;
                    player.classList.remove('playing');
                    cdThumbAnimate.pause();
                }

                //Xử lý tắt âm thanh
                volumeBtnHight.onclick = function () {
                    volumeBtnHight.style.display = 'none'
                    volumeBtnMute.style.display = 'block'
                    audio.volume = 0;
                    progressVolume.value = 0;

                }

                ////Xử lý bật âm thanh
                volumeBtnMute.onclick = function () {
                    volumeBtnHight.style.display = 'block'
                    volumeBtnMute.style.display = 'none'
                    if (currentVolume === 0) {
                        currentVolume = 1;
                    }
                    audio.volume = currentVolume;
                    progressVolume.value = currentVolume * 100;
                }

                progressVolume.onclick = function () {
                    audio.volume = progressVolume.value / 100;
                    currentVolume = audio.volume
                }

                progressVolume.onmousemove = function () {
                    audio.volume = progressVolume.value / 100;
                    currentVolume = audio.volume
                    if (audio.volume === 0) {
                        volumeBtnHight.style.display = 'none'
                        volumeBtnMute.style.display = 'block'
                    } else {
                        volumeBtnHight.style.display = 'block'
                        volumeBtnMute.style.display = 'none'
                    }

                }

                //Khi tiến độ bài hát thay đổi
                audio.ontimeupdate = function () {
                    if (_this.isDraggingProcess && audio.duration) {
                        const progressPerent = Math.floor(audio.currentTime / audio.duration * 100)
                        progress.value = progressPerent
                        startTimeSong = audio.currentTime
                        progressVolume.value = audio.volume * 100
                        _this.startTimeSong(audio.currentTime)
                        _this.endTimeSong();
                        _this.setConfig('lastSong', _this.currentIndex);
                        _this.setConfig('lastVolume', audio.volume);
                        _this.setConfig('lastProgress', audio.currentTime);

                    }
                }

                //Xử lý khi tua bài hát
                progress.onchange = function (e) {
                    //ko gán trực tiếp mà đặt biến ==> tư duy clean code.
                    //clean là dễ hiểu
                    const seekTime = e.target.value * audio.duration / 100;
                    audio.currentTime = seekTime;
                    _this.startTimeSong(audio.currentTime)
                }

                //Xử lý khi 
                progress.onmousedown = function () {
                    _this.isDraggingProcess = false;
                }

                progress.onmouseup = function () {
                    _this.isDraggingProcess = true;
                }

                //khi next song
                nextBtn.onclick = function () {
                    if (_this.isRandom) {
                        _this.playRandomSong();
                    }
                    else {
                        _this.nextSong();
                    }
                    audio.play();

                    //nếu nhiều bài hát thì không nên render lại
                    _this.render();
                    _this.scrollToActiveSong()
                }

                //khi prev song
                prevBtn.onclick = function () {
                    if (_this.isRandom) {
                        _this.playRandomSong();
                    }
                    else {
                        _this.prevSong();
                    }
                    audio.play();

                    //nếu nhiều bài hát thì không nên render lại
                    _this.render();
                    _this.scrollToActiveSong()
                }

                //Xử lý bât / tắt random song
                randomBtn.onclick = function () {
                    _this.isRandom = !_this.isRandom;
                    _this.setConfig('isRandom', _this.isRandom);
                    //đọc kĩ api toggle của classlist
                    // 2 đối số: đối số thứ 2 là boolean - nếu là true thì nó sẽ add, nếu false thì remove 
                    randomBtn.classList.toggle('active', _this.isRandom);
                }

                //Xử lý lặp lại 1 song
                repeatBtn.onclick = function () {
                    _this.isRepeat = !_this.isRepeat;
                    _this.setConfig('isRepeat', _this.isRepeat);
                    repeatBtn.classList.toggle('active', _this.isRepeat);
                }

                //Xử lý next song khi audio ended 
                audio.onended = function () {
                    if (_this.isRepeat) {
                        audio.play();
                    } else {
                        nextBtn.click();
                    }
                }

                playlist.onclick = function (e) {
                    const songNode = e.target.closest('.song:not(.active)')
                    //Xử lý khi click vào song ta chuyển đến bài đó
                    //closest trả về element 1 là chính nó 2 là thẻ cha của nó, không có trả vè null
                    if (songNode || e.target.closest('.option')) {
                        //xử lý khi click vào song
                        if (songNode) {
                            //thay vì songNode.getAttribute('data-index') thì dùng songNode.dataset.index
                            //dùng songNode.dataset.index trả về chuỗi nên convert sang number
                            _this.currentIndex = Number(songNode.dataset.index) //đã đặt data- thì dùng dataset
                            _this.loadCurrentSong()
                            audio.play();
                            _this.render();
                        }

                        //xử lý khi click vào option
                        if (e.target.closest('.option')) {

                        }
                    }
                }
            },

            //Xử lý bài hát đang phát luôn nằm trong giao diện thấy được
            scrollToActiveSong: function () {
                setTimeout(() => {
                    $('.song.active').scrollIntoView({
                        behavior: 'smooth',
                        block: 'end'
                        // inline: 'nearest'
                    })
                }, 300)
            },

            //xử lý load cấu hình khi mới chạy 
            loadConfig: function () {
                this.isRandom = this.config.isRandom
                this.isRepeat = this.config.isRepeat
                this.currentIndex = this.config.lastSong
                audio.currentTime = this.config.lastProgress
                audio.volume = this.config.lastVolume
                // //có thể dùng như vầy để hợp nhất cấu hình this.config vào this nhưng không an toàn vào tương lai trong config có nhiều key không mong muôn hợp nhất vào this
                // Object.assign(this, this.config)
            },

            //Hàm tải thông tin bài hát đầu tiên khi vào UI
            loadCurrentSong: function () {
                heading.textContent = this.currentSong.name;
                cdThumb.style.backgroundImage = `url(${this.currentSong.image})`;
                audio.src = this.currentSong.path;
            },

            //Xử lý tới bài hát kế tiếp
            nextSong: function () {
                this.currentIndex++;
                if (this.currentIndex >= this.songs.length) {
                    this.currentIndex = 0;
                }
                this.loadCurrentSong();
            },

            //Xử lý quay lại bài hát trước đó
            prevSong: function () {
                this.currentIndex--;
                if (this.currentIndex < 0) {
                    this.currentIndex = this.songs.length - 1;
                }
                this.loadCurrentSong();
            },

            //Xử lý tới bài hát ngẫu nhiên
            playRandomSong: function () {
                if (songPlayed.length === this.songs.length) {
                    songPlayed = []
                }

                let newIndex
                do {
                    newIndex = Math.floor(Math.random() * this.songs.length);
                } while (songPlayed.includes(newIndex));
                this.currentIndex = newIndex
                this.loadCurrentSong()
                songPlayed.push(newIndex)
            },

            //Xử lí thời gian bắt đầu của bài hát
            startTimeSong: function (e) {
                let minute = Math.floor(e / 60);
                let second = Math.floor(e % 60);

                let displayMinute = minute < 10 ? ('0' + minute) : minute
                let displaySecond = second < 10 ? ('0' + second) : second

                timeStart.textContent = `${displayMinute} : ${displaySecond}`
            },

            ////Xử lí thời gian của bài hát
            endTimeSong: function () {
                let minute = Math.floor(audio.duration / 60);
                let second = Math.floor(audio.duration % 60);
                let displayMinute = minute < 10 ? ('0' + minute) : minute
                let displaySecond = second < 10 ? ('0' + second) : second
                timeEnd.textContent = `${displayMinute} : ${displaySecond}`
            },


            start: function () {
                //Gán cấu hình từ config vào ứng dụng
                this.loadConfig()

                //định nghĩa các thuộc tính cho object
                this.defineProperties();

                //lắng nghe/ xử lý các sự kiên (DOM events)
                this.handeleEvents();

                //Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
                this.loadCurrentSong();

                // Render playlist
                this.render()

                //Hiển thị trạng thái ban đầu của button repeat & random
                randomBtn.classList.toggle('active', this.isRandom);
                repeatBtn.classList.toggle('active', this.isRepeat);
            }
        }

        app.start();