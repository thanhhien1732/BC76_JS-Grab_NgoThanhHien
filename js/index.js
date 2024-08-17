const GRAB_CAR = "grabCar";
const GRAB_SUV = "grabSUV";
const GRAB_BLACK = "grabBlack";

function giaKmDauTien(loaiXe) {
    switch (loaiXe) {
        case GRAB_CAR:
            return 8000;
        case GRAB_SUV:
            return 9000;
        case GRAB_BLACK:
            return 10000;
    }
}

function giaKmTu1Den19(loaiXe) {
    switch (loaiXe) {
        case GRAB_CAR:
            return 7500;
        case GRAB_SUV:
            return 8500;
        case GRAB_BLACK:
            return 9500;
    }
}

function giaKmTu19TroLen(loaiXe) {
    switch (loaiXe) {
        case GRAB_CAR:
            return 7000;
        case GRAB_SUV:
            return 8000;
        case GRAB_BLACK:
            return 9000;
    }
}

function giaThoiGianCho(loaiXe) {
    switch (loaiXe) {
        case GRAB_CAR:
            return 2000;
        case GRAB_SUV:
            return 3000;
        case GRAB_BLACK:
            return 3500;
    }
}

// Hàm định dạng số với dấu phân cách hàng nghìn
function dinhDangSo(num) {
    return num.toLocaleString('vi-VN');
}

// Hàm lấy thông tin loại xe và số km, thời gian chờ
function layThongTinXe() {
    let soKm = document.getElementById("txt-km").value.trim();
    let thoiGianCho = document.getElementById("txt-thoiGianCho").value.trim();
    let loaiXeGrabCar = document.querySelector("input[name='selector']:checked");

    if (!loaiXeGrabCar) {
        alert("Vui lòng chọn loại xe");
        return null;
    }

    if (soKm === "" || isNaN(soKm) || soKm <= 0) {
        alert("Vui lòng nhập số km hợp lệ");
        return null;
    }

    if (thoiGianCho === "" || isNaN(thoiGianCho) || thoiGianCho < 0) {
        alert("Vui lòng nhập thời gian chờ hợp lệ");
        return null;
    }

    let loaiXe = loaiXeGrabCar.value;
    soKm = parseFloat(soKm);
    thoiGianCho = parseFloat(thoiGianCho);

    return { soKm, thoiGianCho, loaiXe };
}

// Hàm tính toán tổng tiền
function tinhTongTien(loaiXe, soKm, thoiGianCho) {
    let tienKmDauTien = giaKmDauTien(loaiXe);
    let tienKmTu1Den19 = giaKmTu1Den19(loaiXe);
    let tienKmTu19TroLen = giaKmTu19TroLen(loaiXe);
    let tienTgCho = giaThoiGianCho(loaiXe);
    let tongTien = 0;

    if (soKm <= 19) {
        tongTien = 1 * tienKmDauTien + (soKm - 1) * tienKmTu1Den19;
    } else {
        tongTien = 1 * tienKmDauTien + 18 * tienKmTu1Den19 + (soKm - 19) * tienKmTu19TroLen;
    }

    // Cập nhật lại cách tính số phút phạt sau 3 phút đầu tiên
    let soLanPhat = thoiGianCho > 3 ? thoiGianCho - 3 : 0;
    tongTien += soLanPhat * tienTgCho;

    let tienKmDauTienPart = tienKmDauTien;
    let tienKmTu1Den19Part = soKm <= 19 ? (soKm - 1) * tienKmTu1Den19 : 18 * tienKmTu1Den19;
    let tienKmTu19TroLenPart = soKm > 19 ? (soKm - 19) * tienKmTu19TroLen : 0;
    let tienTgChoPart = soLanPhat * tienTgCho;

    return { tongTien, tienKmDauTienPart, tienKmTu1Den19Part, tienKmTu19TroLenPart, tienTgChoPart, soLanPhat };
}


function xuatHoaDon(thongTinXe, ketQuaTinhTien) {
    let { soKm, loaiXe } = thongTinXe;
    let { tongTien, tienKmDauTienPart, tienKmTu1Den19Part, tienKmTu19TroLenPart, tienTgChoPart, soLanPhat } = ketQuaTinhTien;

    $('#exampleModal').modal('show');
    document.querySelector(".modal-body").innerHTML = `
    <table class="table table-bordered">
        <thead>
            <tr>
            <th>Loại xe</th>
            <td>${loaiXe}</td>
            <th>Số km</th>
            <td>${dinhDangSo(soKm)} km</td>
            </tr>
        </thead>
        <tbody>
            <tr>
                <th>CHI TIẾT</th>
                <th>SỬ DỤNG</th>
                <th>ĐƠN GIÁ (VND)</th>
                <th>THÀNH TIỀN (VND)</th>
            </tr>
            <tr>
                <th>Km đầu tiên</th>
                <td>1 km</td>
                <td>${dinhDangSo(tienKmDauTienPart)}</td>
                <td>${dinhDangSo(tienKmDauTienPart)}</td>
            </tr>
            <tr>
                <th>${soKm <= 19 ? 'Từ 1 km đến ' + soKm + ' km' : 'Từ 1 km đến 19 km'}</th>
                <td>${soKm <= 19 ? soKm - 1 : 18} km</td>
                <td>${dinhDangSo(giaKmTu1Den19(loaiXe))}</td>
                <td>${dinhDangSo(tienKmTu1Den19Part)}</td>
            </tr>
            ${soKm > 19 ? `
            <tr>
                <th>Từ 19 Km trở lên</th>
                <td>${soKm - 19} km</td>
                <td>${dinhDangSo(giaKmTu19TroLen(loaiXe))}</td>
                <td>${dinhDangSo(tienKmTu19TroLenPart)}</td>
            </tr>` : ''}
            <tr>
                <th>Thời gian chờ <br> (Miễn phí 3 phút đầu)</th>
                <td>${dinhDangSo(soLanPhat)} phút</td>
                <td>${dinhDangSo(giaThoiGianCho(loaiXe))}</td>
                <td>${dinhDangSo(tienTgChoPart)}</td>
            </tr>
        </tbody>
        <tfoot>
            <tr>
                <th colspan="3" style="font-size: 20px; text-align: center;">TỔNG TIỀN</th>
                <td style="font-size: 20px; color: red;">${dinhDangSo(tongTien)} VND</td>
            </tr>
        </tfoot>
    </table>`;
}

document.getElementById("btnTinhTien").onclick = function () {
    let thongTinXe = layThongTinXe();
    if (!thongTinXe) return;

    let ketQuaTinhTien = tinhTongTien(thongTinXe.loaiXe, thongTinXe.soKm, thongTinXe.thoiGianCho);
    let thanhTien = document.getElementById("divThanhTien");
    thanhTien.style.display = "block";
    document.querySelector(".xuatTien").innerHTML = `${dinhDangSo(ketQuaTinhTien.tongTien)} VND`;
}

document.getElementById("btnInHoaDon").onclick = function () {
    let thongTinXe = layThongTinXe();
    if (!thongTinXe) return;

    let ketQuaTinhTien = tinhTongTien(thongTinXe.loaiXe, thongTinXe.soKm, thongTinXe.thoiGianCho);
    xuatHoaDon(thongTinXe, ketQuaTinhTien);
}


