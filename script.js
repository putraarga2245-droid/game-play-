// --- AMBIL ELEMEN DOM ---
let untuk_daftar = document.getElementById("untuk_daftar");
let untuk_login = document.getElementById("untuk_login");
let wadah_text = document.getElementById("wadah_text");
let ruang_game = document.getElementById("ruang_game");

let input_01 = document.getElementById("input_01"); // email daftar
let input_02 = document.getElementById("input_02"); // sandi daftar
let button_01 = document.getElementById("button_01"); // tombol daftar

let input_03 = document.getElementById("input_03"); // email login
let input_04 = document.getElementById("input_04"); // sandi login
let button_02 = document.getElementById("button_02"); // tombol login

let text_01 = document.getElementById("text_01");
let button_03 = document.getElementById("button_03"); // tombol ok wadah text

let pindah_ke_login = document.getElementById("pindah_ke_login");
let pindah_ke_daftar = document.getElementById("pindah_ke_daftar");

// --- NAVIGASI ANTAR HALAMAN ---
pindah_ke_login.addEventListener("click", function(){
  untuk_daftar.style.display = "none";
  untuk_login.style.display = "flex";
});

pindah_ke_daftar.addEventListener("click", function(){
  untuk_login.style.display = "none";
  untuk_daftar.style.display = "flex";
});


// ==========================================
// 1. TOMBOL DAFTAR (Multi-Akun localStorage + length & i++)
// ==========================================
button_01.addEventListener("click", function(){
  let email_baru = input_01.value;
  let sandi_baru = input_02.value;

  if(email_baru === "" || sandi_baru === ""){
    alert("Email dan sandi harus diisi!");
    return;
  }

  let simpanan = localStorage.getItem("data_semua_akun");
  let list_akun = simpanan ? JSON.parse(simpanan) : [];

  let sudah_ada = false;
  for(let i = 0; i < list_akun.length; i++){
    if(list_akun[i].email === email_baru){
      sudah_ada = true;
      break;
    }
  }

  if(sudah_ada === true){
    alert("Email sudah terdaftar!");
  } else {
    list_akun.push({
      email: email_baru,
      sandi: sandi_baru
    });

    localStorage.setItem("data_semua_akun", JSON.stringify(list_akun));
    alert("Daftar Berhasil! Total akun: " + list_akun.length);

    input_01.value = "";
    input_02.value = "";

    untuk_daftar.style.display = "none";
    untuk_login.style.display = "flex";
  }
});


// ==========================================
// 2. TOMBOL LOGIN
// ==========================================
button_02.addEventListener("click", function(){
  let email_masuk = input_03.value;
  let sandi_masuk = input_04.value;

  let simpanan = localStorage.getItem("data_semua_akun");
  let list_akun = simpanan ? JSON.parse(simpanan) : [];

  let login_sukses = false;

  for(let i = 0; i < list_akun.length; i++){
    if(list_akun[i].email === email_masuk && list_akun[i].sandi === sandi_masuk){
      login_sukses = true;
      break;
    }
  }

  if(login_sukses === true){
    alert("Login Berhasil!");
    untuk_login.style.display = "none";
    wadah_text.style.display = "flex";
  } else {
    alert("Email atau sandi salah, atau belum terdaftar!");
  }
});


// ==========================================
// 3. WADAH KATA "MASUK"
// ==========================================
button_03.addEventListener("click", function(){
  if(text_01.value === "masuk"){
    wadah_text.style.display = "none";
    ruang_game.style.display = "flex";
    ruang_game.style.zIndex = "6";
  } else {
    alert("salah! Ketik kata: masuk");
  }
});


// ==========================================
// 4. LOGIKA GAME ULAR (Layar Lebar & Tabrakan Dinding)
// ==========================================
let kepala_01 = document.getElementById("kepala_01");
let badan_01 = document.getElementsByClassName("badan");
let umpan_01 = document.getElementById("umpan_01");
let skor_01 = document.getElementById("skor_01");
let arena_game = document.getElementById("arena_game");

let button_kanan = document.getElementById("button_kanan");
let button_bawah = document.getElementById("button_bawah");
let button_kiri = document.getElementById("button_kiri");
let button_atas = document.getElementById("button_atas");

let awal_x = 0;
let awal_y = 0;

let umpan_x = 150;
let umpan_y = 100;
let skor = 0;

// Batas Maksimal Arena (Lebar 450px, Tinggi 250px, Kotak 50px)
let batas_kanan = 400; 
let batas_bawah = 200;

// Fungsi untuk mereset game jika menabrak dinding
function cek_game_over() {
  if (awal_x < 0 || awal_x > batas_kanan || awal_y < 0 || awal_y > batas_bawah) {
    alert("Game Over! Anda menabrak dinding garis tepi. Skor akhir: " + skor);
    
    // Reset posisi kepala ke awal
    awal_x = 0;
    awal_y = 0;
    skor = 0;
    skor_01.innerText = skor;
    kepala_01.style.left = awal_x + "px";
    kepala_01.style.top = awal_y + "px";

    // Hapus semua elemen badan tambahan yang ada di arena
    let semua_badan = arena_game.getElementsByClassName("badan");
    // Karena elemen pertama adalah kepala, kita hapus sisa badan dari belakang
    for (let i = semua_badan.length - 1; i > 0; i--) {
      semua_badan[i].remove();
    }
    return true; // Menandakan game over
  }
  return false;
}

// TOMBOL KANAN
button_kanan.addEventListener("click", function() {
  let untuk_dua_x = awal_x + "px";
  let untuk_dua_y = awal_y + "px";

  awal_x += 50;

  // Cek tabrakan dinding sebelum menggeser kepala
  if (cek_game_over()) return;

  kepala_01.style.left = awal_x + "px";

  for (let i = 1; i < badan_01.length; i++) {
    let sementara_x = badan_01[i].style.left;
    let sementara_y = badan_01[i].style.top;

    badan_01[i].style.left = untuk_dua_x;
    badan_01[i].style.top = untuk_dua_y;

    untuk_dua_x = sementara_x;
    untuk_dua_y = sementara_y;
  }

  if (awal_x == umpan_x && awal_y == umpan_y) {
    skor += 10;
    skor_01.innerText = skor;

    let span_baru = document.createElement("span");
    span_baru.className = "badan";
    span_baru.style.left = untuk_dua_x;
    span_baru.style.top = untuk_dua_y;
    arena_game.appendChild(span_baru);

    umpan_01.style.display = "none";
    umpan_x = Math.floor(Math.random() * 9) * 50; // Lebar 9 kolom (0 - 400)
    umpan_y = Math.floor(Math.random() * 5) * 50; // Tinggi 5 baris (0 - 200)
    umpan_01.style.left = umpan_x + "px";
    umpan_01.style.top = umpan_y + "px";
    umpan_01.style.display = "block";
  }
});

// TOMBOL BAWAH
button_bawah.addEventListener("click", function() {
  let untuk_dua_x = awal_x + "px";
  let untuk_dua_y = awal_y + "px";

  awal_y += 50;

  if (cek_game_over()) return;

  kepala_01.style.top = awal_y + "px";

  for (let i = 1; i < badan_01.length; i++) {
    let sementara_x = badan_01[i].style.left;
    let sementara_y = badan_01[i].style.top;

    badan_01[i].style.left = untuk_dua_x;
    badan_01[i].style.top = untuk_dua_y;

    untuk_dua_x = sementara_x;
    untuk_dua_y = sementara_y;
  }

  if (awal_x == umpan_x && awal_y == umpan_y) {
    skor += 10;
    skor_01.innerText = skor;

    let span_baru = document.createElement("span");
    span_baru.className = "badan";
    span_baru.style.left = untuk_dua_x;
    span_baru.style.top = untuk_dua_y;
    arena_game.appendChild(span_baru);

    umpan_01.style.display = "none";
    umpan_x = Math.floor(Math.random() * 9) * 50;
    umpan_y = Math.floor(Math.random() * 5) * 50;
    umpan_01.style.left = umpan_x + "px";
    umpan_01.style.top = umpan_y + "px";
    umpan_01.style.display = "block";
  }
});

// TOMBOL KIRI
button_kiri.addEventListener("click", function() {
  let untuk_dua_x = awal_x + "px";
  let untuk_dua_y = awal_y + "px";

  awal_x -= 50;

  if (cek_game_over()) return;

  kepala_01.style.left = awal_x + "px";

  for (let i = 1; i < badan_01.length; i++) {
    let sementara_x = badan_01[i].style.left;
    let sementara_y = badan_01[i].style.top;

    badan_01[i].style.left = untuk_dua_x;
    badan_01[i].style.top = untuk_dua_y;

    untuk_dua_x = sementara_x;
    untuk_dua_y = sementara_y;
  }

  if (awal_x == umpan_x && awal_y == umpan_y) {
    skor += 10;
    skor_01.innerText = skor;

    let span_baru = document.createElement("span");
    span_baru.className = "badan";
    span_baru.style.left = untuk_dua_x;
    span_baru.style.top = untuk_dua_y;
    arena_game.appendChild(span_baru);

    umpan_01.style.display = "none";
    umpan_x = Math.floor(Math.random() * 9) * 50;
    umpan_y = Math.floor(Math.random() * 5) * 50;
    umpan_01.style.left = umpan_x + "px";
    umpan_01.style.top = umpan_y + "px";
    umpan_01.style.display = "block";
  }
});

// TOMBOL ATAS
button_atas.addEventListener("click", function() {
  let untuk_dua_x = awal_x + "px";
  let untuk_dua_y = awal_y + "px";

  awal_y -= 50;

  if (cek_game_over()) return;

  kepala_01.style.top = awal_y + "px";

  for (let i = 1; i < badan_01.length; i++) {
    let sementara_x = badan_01[i].style.left;
    let sementara_y = badan_01[i].style.top;

    badan_01[i].style.left = untuk_dua_x;
    badan_01[i].style.top = untuk_dua_y;

    untuk_dua_x = sementara_x;
    untuk_dua_y = sementara_y;
  }

  if (awal_x == umpan_x && awal_y == umpan_y) {
    skor += 10;
    skor_01.innerText = skor;

    let span_baru = document.createElement("span");
    span_baru.className = "badan";
    span_baru.style.left = untuk_dua_x;
    span_baru.style.top = untuk_dua_y;
    arena_game.appendChild(span_baru);

    umpan_01.style.display = "none";
    umpan_x = Math.floor(Math.random() * 9) * 50;
    umpan_y = Math.floor(Math.random() * 5) * 50;
    umpan_01.style.left = umpan_x + "px";
    umpan_01.style.top = umpan_y + "px";
    umpan_01.style.display = "block";
  }
});