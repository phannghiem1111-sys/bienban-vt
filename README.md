# Handoff: Biên Bản Vật Tư Miền Nam — giao diện mobile mới

## Overview
Giao diện mới cho app **Biên Bản Vật Tư MN** (repo `phannghiem1111-sys/bienban-vt`, file `index.html`, backend Google Apps Script + Google Sheet). Mục tiêu: thay lớp giao diện (HTML/CSS/render) của `index.html` bằng thiết kế mới, **giữ nguyên toàn bộ API Apps Script hiện có** (`api(...)`, token, `S.*` state), và bổ sung chức năng **điều chuyển vật tư từ cửa hàng đóng cửa**.

Người dùng: mọi nhân viên kỹ thuật có tài khoản Gmail hoặc mã NV. Vai trò: Nhân viên, Đội trưởng / người duyệt (`S.user.laDuyet`, `vaiTro==='Đội trưởng'`), Quản lý (`S.user.laQuanLy`).

## About the Design Files
`Bien Ban Vat Tu.html` trong gói này là **bản tham chiếu thiết kế bằng HTML** (prototype chạy dữ liệu mẫu) — cho thấy giao diện và hành vi mong muốn, **không phải mã production để copy nguyên**. Nhiệm vụ: dựng lại giao diện này **trong môi trường hiện có của repo** — một file `index.html` vanilla JS (không framework, render bằng chuỗi `innerHTML`, helper `$`, `$$`, `esc`, `api`, `busy`, `toast`, `confirmBox`, `push/back`). Giữ nguyên kiểu code đó, chỉ thay markup/CSS và thêm view mới.

Mở file prototype trên trình duyệt để bấm thử toàn bộ luồng.

## Fidelity
**High-fidelity.** Màu, chữ, khoảng cách, viền, trạng thái là bản cuối. Dựng lại sát pixel.

## Nguyên tắc thị giác (Modernist)
- Font duy nhất **Archivo** (400/600/800) — Google Fonts.
- **Bo góc = 0** ở mọi nơi (trừ khung điện thoại trong prototype, không thuộc app).
- Viền phân khu **2px #201e1d**; viền dòng trong danh sách **1px rgba(32,30,29,.4)**.
- Mọi nhãn căn **trái**, kể cả chữ trong nút rộng (nút full-width: `justify-content:flex-start` hoặc `space-between` khi có mũi tên).
- Màu nhấn đỏ dùng tiết kiệm: nút chính, tab đang chọn, cảnh báo. Khối đỏ lớn chỉ ở màn đăng nhập.
- Lựa chọn (chip/segmented): ô viền 2px ink; **đang chọn = nền ink #201e1d + chữ #f3f2f2**; chưa chọn = nền trong suốt + chữ ink.
- Ảnh hiển thị đen trắng (`filter: grayscale(1)`).
- Icon: **Lucide** (layout-grid, file-text, plus, scan-line, package, chevron-left, chevron-right, search, camera, x, log-out, arrow-right, arrow-left-right).
- Hit target tối thiểu 44px.

## Khung chung (mọi màn sau đăng nhập)
Cột dọc full màn hình: **Header** → **Nội dung cuộn** → **Tab bar** (dính đáy, có `padding-bottom: env(safe-area-inset-bottom)`).

**Header** — padding 8px 16px 12px, border-bottom 2px ink.
- Nút back (chevron-left 24px, vùng 44×44) khi có lịch sử (`push`).
- Kicker: 11px / 600 / uppercase / letter-spacing .08em / #605d5d.
- Tiêu đề: 24px / 800 / line-height 1.1, cắt ellipsis.
- Màn Tổng quan: bên phải "Thoát" + icon log-out (13px).

**Tab bar** — grid 5 cột đều, border-top 2px ink, nền #f3f2f2. Mỗi tab: min-height 58px, icon 22px trên, nhãn 11px/600 dưới, **căn trái** (padding 0 10px). Tab đang chọn: **vạch đỏ 4px phía trên** (#ec3013).
1. Tổng quan · 2. Biên bản (badge đỏ số "Chờ duyệt" nếu là người duyệt) · 3. **Lập mới** (ô nền đỏ, chữ/icon #f3f2f2, icon plus) · 4. Quét QR · 5. Tồn kho.
Tab "Lập mới" thay nút `plus` hiện tại; "Duyệt" của repo gộp vào tab Biên bản (bộ lọc "Chờ duyệt"). "Điều phối" đưa vào Tổng quan (xem dưới). "Cảnh báo" (desk) chưa thiết kế.

**Toast** — absolute, cách đáy 96px, trái/phải 12px, nền ink, chữ #f3f2f2 14px/600, padding 14px 16px, shadow-md, tự ẩn 2.2s.

**Bottom sheet** (thay cho `#overlay .box`) — backdrop `rgba(32,30,29,.45)`, sheet bám đáy, nền #f3f2f2, border-top 2px ink, padding 16px 16px 34px, max-height 80%, cuộn. Đầu sheet: kicker + tiêu đề 22px/800 + nút X 44×44. Bấm backdrop để đóng.

## Screens / Views

### 1. Đăng nhập (`viewLogin`)
- **Khối đỏ** (nền #ec3013, chữ #f3f2f2), padding 28px 24px 24px, flex cột gap 24px:
  - Hàng trên: logo WinCommerce trắng (`assets/wincommerce-white.png`, cao 40px, lệch trái -6px) — phải: "v44" 12px.
  - Tiêu đề 3 dòng "Biên bản / vật tư / Miền Nam" — Archivo 800, **40px**, line-height .95, letter-spacing -.02em. (Người dùng đã chỉnh cỡ 40px; một lần chỉnh màu chữ sang accent — nếu chữ nằm trên nền đỏ hãy dùng #f3f2f2.)
  - Mô tả 14px/1.4, max-width 280px: "Lập biên bản, theo dõi duyệt và tra tồn kho vật tư ngay trên điện thoại."
- **Form**, padding 24px, gap 16px:
  - Segmented 2 ô (viền 2px ink, cao 44px): "Mã nhân viên" | "Gmail".
  - Mã NV: label 13px/600 "Mã NV hoặc email" + input (min-height 44px, 16px) placeholder "VD: 3013872 hoặc nghiempt2"; "PIN (4–6 số)" input password numeric, letter-spacing .3em, placeholder "••••". Ghi chú 12px #605d5d: "Lần đầu đăng nhập: PIN bạn nhập sẽ được lưu làm PIN của bạn."
  - Gmail: mô tả "Dùng tài khoản Gmail đã đăng ký với quản lý." + ô tài khoản (viền 2px, tên 15px/600, email 13px #605d5d). Thực tế: tích hợp Google Sign-In / `Session.getActiveUser()` của Apps Script.
  - Lỗi 13px/600 #ae1800: "Nhập mã nhân viên hoặc email." / "PIN cần 4–6 số."
  - Nút chính full-width, cao 52px, nền #ec3013 (hover #dd2b0f, active #ae1800), chữ "Đăng nhập" trái + arrow-right phải.

### 2. Tổng quan (`dash`)
Header: kicker "Xin chào, {tenNgan}", tiêu đề "Tổng quan".
- **Lưới thống kê 2×2** (mỗi ô min-height 104px, padding 12px 16px, border-bottom 2px, ô trái có border-right 2px): số 40px/800, nhãn 13px/600 ở đáy. Ô: Nháp · Quá hạn chưa upload · Chờ duyệt · Đã duyệt. Ô "Quá hạn" khi >0: **nền đỏ, chữ #f3f2f2**. Bấm → tab Biên bản với bộ lọc tương ứng.
- **Hàng "Điều phối vật tư"** (chỉ Đội trưởng/Quản lý): min-height 64px, icon arrow-left-right 24px, tiêu đề 15px/800, phụ đề 12px "Chuyển vật tư giữa các nhân viên", chevron-right; border-bottom 2px.
- **Vật tư sắp hết** (tiêu đề 17px/800 + nút ghost "Xem tất cả" → Tồn kho lọc Sắp hết): tối đa 3 dòng, tồn ≤ ngưỡng (mặc định 5). Dòng: tên 15px/600, mã 12px #605d5d tabular-nums; phải: số tồn 18px/800 #ae1800 + ĐVT 12px. Bấm → sheet chi tiết vật tư.
- **Biên bản gần đây** (border-top 2px): 3 dòng thẻ biên bản (xem mục 3).

### 3. Biên bản (`mine` + `team`)
- Thanh lọc cuộn ngang, padding 12px 16px, gap 8px: chip cao 36px viền 2px: Tất cả · Nháp · Đã in · Quá hạn · Chờ duyệt · Đã duyệt, mỗi chip kèm số đếm (opacity .75).
- **Dòng biên bản**: padding 12px 16px, border-bottom 1px. Hàng 1: số BB 13px/600 tabular + tag trạng thái phải. Hàng 2: tên cửa hàng 15px/600. Hàng 3: "{ngày} · {hạng mục} · {n} vật tư" 12px #605d5d. Nếu bị trả lại: "Bị trả lại: {ghiChuDuyet}" 12px/600 #ae1800.
- **Tag trạng thái** (11px, padding 3px 10px, không bo):
  - Nháp → viền 1px #ec3013, chữ #ec3013
  - Đã xuất bản in → nền #f8f4f4, chữ #444141 ("Đã in")
  - Đã in và `daysSince(ngayIn) >= soNgayCanhBao` → nền #fff2ef, chữ #7c1405 ("Quá hạn · N ngày")
  - Đã upload bản ký → nền #fff2ef, chữ #7c1405 ("Chờ duyệt")
  - Xuất kho / Mua mới / Bảo hành → nền #f8f4f4, chữ #444141 ("Đã duyệt · X")
- Rỗng: "Không có biên bản nào ở mục này."

### 4. Chi tiết biên bản (`viewDetail`)
Header: back, kicker "Biên bản · {hạng mục}", tiêu đề số BB.
- **Thanh tiến trình 4 bước** (grid 4 cột, border-bottom 2px): mỗi ô border-top 6px, số "01–04" 11px/800, nhãn 11px. Bước đã qua: ink; bước hiện tại (trừ bước 4): đỏ; chưa tới: #eae7e7. Nhãn: Nháp · Đã in · Đã upload · Đã duyệt.
- Thông báo (nền #fff2ef, chữ #7c1405, 13px, padding 10px 12px): bị trả lại / nhắc upload bản ký sau khi in (dùng đúng câu chữ repo).
- **Lưới thông tin 2 cột** (padding 0 16px): mỗi ô border-bottom 1px, khoá 11px uppercase #605d5d, giá trị 14px/600: Cửa hàng · Mã SAP · Hạng mục · Ngày lập · Đề xuất · Trạng thái.
- "Nội dung sự việc" (khoá) + đoạn 14px/1.45.
- **Vật tư thay thế** (border-top 2px, tiêu đề 17px/800, phải "{n} khoản"): dòng tên 14px/600 + "Mã …" 12px; phải SL 16px/800 + ĐVT.
- **Ảnh** (border-top 2px): 2 cột "Ảnh trước" / "Ảnh sau", tỉ lệ 4:3, grayscale.
- **Hành động** (nút full-width cao 52px, chữ trái), theo trạng thái — giữ logic repo dòng 2701–2704:
  - Nháp: "Xuất bản in" (chính)
  - Đã in: "Upload bản ký" (chính) · "Sửa lại (tạo phiên bản mới)" (phụ: viền 1px, nền trong)
  - Đã upload: người duyệt thấy "Duyệt biên bản" (chính) → sheet Duyệt; người lập thấy "Upload lại bản ký" + "Sửa lại…"
  - Có `pdfUrl`: thêm "Mở PDF để in" (phụ).

**Sheet Duyệt** (thay dialog repo dòng 2751): tiêu đề "Duyệt / {soBB}". "Kết quả": lưới 2×2 viền 2px, mỗi ô cao 48px: Xuất kho · Mua mới · Bảo hành · Trả lại (mặc định = đề xuất của biên bản). "Ghi chú" textarea; chọn Trả lại → hiện "Bắt buộc khi trả lại" (#ae1800) và nút "Xác nhận" bị khoá (opacity .45) đến khi có ghi chú. Chọn Xuất kho → gợi ý 12px "Tồn kho sẽ được trừ theo số lượng vật tư trong biên bản."

### 5. Lập mới (`viewNew`)
Header kicker "Biên bản mới", tiêu đề "Lập mới". Các khối cách nhau bằng border-top 2px, padding 16px; tiêu đề khối 15px/800.
1. **Thông tin chung**: "Cửa hàng" (gõ mã SAP hoặc tên, autocomplete từ `S.stores`: hộp viền 2px, mỗi gợi ý cao 44px "**6317** · tên"). "Hạng mục": chip cao 40px từ `S.hangMuc`. "Nội dung sự việc": textarea 3 dòng.
   *(Các trường repo khác — Tên CHT, Email nhận, Mã ticket, Hạng mục khác — giữ nguyên, cùng kiểu label + input.)*
2. **Vật tư thay thế**: mỗi dòng grid `1fr 72px 44px`: tên + "Mã … · tồn N ĐVT" | ô SL (number, căn phải) | nút X. Dưới cùng ô tìm có icon search: "Gõ tên (vd “băng keo”) hoặc mã vật tư" → hộp gợi ý (tên, mã, "Tồn N ĐVT"); chọn = thêm dòng.
3. **Đề xuất xử lý**: segmented 3 ô từ `S.deXuat` (Xuất kho · Mua mới · Bảo hành).
4. **Ảnh hiện trường**: 2 ô 4:3 viền 2px đứt nét: icon camera + "Ảnh trước · n" / "Ảnh sau · n" (giữ nút 📷 chụp / 🖼 chọn nhiều của repo). Ghi chú "Không in ra, chỉ lưu trên app."
- **Validate khi bấm "Lưu nháp"** (nút chính + arrow): liệt kê lỗi 13px/600 #ae1800 dạng "— …": chọn cửa hàng trong gợi ý · chọn hạng mục · nhập nội dung · thêm vật tư và số lượng > 0 · chọn đề xuất · ít nhất 1 ảnh trước. Thành công → mở chi tiết + toast "Đã lưu nháp {soBB}".

### 6. Quét QR (`viewScan`)
Nền toàn vùng nội dung #201e1d, chữ #f3f2f2, padding 24px 16px. Mô tả 14px: "Đưa mã QR in trên biên bản đã ký vào khung để mở và upload bản ký." Khung camera vuông full-width nền #444141, 4 góc ngoặc đỏ 48×48 viền 4px ở 12% từ mép, vạch quét ngang đỏ 2px. Quét được → mở chi tiết biên bản + toast "Đã nhận mã {soBB}" (logic repo dòng ~2790).

### 7. Tồn kho (`traTonKho`)
- Khối trên (border-bottom 2px): ô tìm "Tìm mã hoặc tên vật tư…" + segmented "Tất cả · N" | "Sắp hết · N".
- Hàng tiêu đề cột 11px uppercase: "Vật tư" | "Tồn".
- Dòng (min-height 60px): tên 15px/600, "{mã} · {n} người giữ" 12px; phải tồn 18px/800 (≤ ngưỡng: #ae1800) + ĐVT.
- Bấm → **sheet vật tư**: kicker "Mã …", tiêu đề tên; khối 2 cột (viền 2px trên/dưới): "Tồn kho" 28px/800 + ĐVT | "Đơn giá" 20px/800 (định dạng vi-VN + " đ"); "Đang giữ · tổng N ĐVT"; danh sách người giữ (tên | số) — tương ứng dialog repo dòng 1947.

### 8. Điều phối (`viewDC`) — có mở rộng
Header: back, kicker "Đội trưởng · Quản lý", tiêu đề "Điều phối". Băng thông tin (nền #eae9e9, 13px): "Quản trị: điều chuyển giữa mọi nhân viên." hoặc "Đội trưởng: điều chuyển giữa các nhân viên trong đội." + " Số lượng chuyển trừ ở người đi và cộng cho người nhận."

Nhãn bước: 11px/600 uppercase #605d5d.

**01 · Nguồn chuyển** — segmented "Nhân viên" | "Cửa hàng đóng cửa".
- *Nhân viên*: lưới 2 cột (viền 2px dạng ô lưới), mỗi ô min-height 52px: tên 14px/600 + "{n} loại vật tư" 11px.
- *Cửa hàng đóng cửa* (**MỚI**): input "Mã cửa hàng (SAP)" numeric, placeholder "VD: 7012". Tìm thấy → thẻ viền 2px: tên CH 14px/600, "Đóng cửa {ngày} · {n} loại vật tư còn lại" 12px, tag đỏ "Đóng cửa". Không thấy (≥4 số) → "Không tìm thấy cửa hàng đóng cửa có mã này." (#ae1800). Khi chưa nhập: hàng chip gợi ý các CH đóng cửa ("**7012** · Cao Thắng").

**02 · Chuyển đến** — lưới 2 cột: các nhân viên + **"Kho chính"** (MỚI). Người nguồn bị khoá (opacity .35).

**03 · Vật tư của {nguồn}** (phải: "SL chuyển")
- Nguồn = cửa hàng: segmented **"Chọn có sẵn" | "Nhập tay · n"** (MỚI).
- *Chọn có sẵn* (và nguồn nhân viên): ô lọc "Nhập mã vật tư hoặc tên để lọc…"; dòng grid `1fr 84px`: tên + "{mã} · đang giữ N ĐVT" (chữ đỏ #ae1800 nếu SL nhập > số còn) | ô SL number căn phải.
- *Nhập tay*: ghi chú "Gõ mã hoặc tên: chọn gợi ý từ danh mục để tự điền, hoặc nhập tay hoàn toàn nếu vật tư chưa có mã." Ô **Mã vật tư** (gợi ý theo mã từ `S.vatTu`, hiển thị "**mã** · tên") và ô **Tên vật tư** (gợi ý khi ≥2 ký tự, hiển thị "tên · **mã**"); chọn gợi ý → tự điền mã + tên + ĐVT. Ô ĐVT + ô Số lượng (2 cột). Nút phụ viền 2px ink "+ Thêm vào danh sách chuyển". Lỗi: "Nhập mã hoặc tên vật tư." / "Nhập số lượng lớn hơn 0." / "Nhập mã cửa hàng đóng cửa trước." Các dòng đã thêm: tên, "{mã} · Có trong danh mục | Nhập tay · vật tư mới", SL + ĐVT, nút X.
- Một lần điều chuyển có thể gộp cả dòng chọn sẵn và dòng nhập tay.

**Thanh tổng (sticky đáy vùng cuộn)**, border-top 2px: trái 12px "Đã chọn n loại · {nguồn} → {đích | chưa chọn nơi nhận}" / "Nhập số lượng cho vật tư cần chuyển." / "Số lượng chuyển vượt quá số còn lại."; phải nút chính "Điều chuyển" (khoá khi: không có dòng, chưa chọn đích, hoặc vượt số).
→ **Sheet xác nhận** (thay `confirmBox` dòng 2510): "Chuyển n loại vật tư từ **nguồn** sang **đích**? Tồn kho sẽ cập nhật ngay." + danh sách dòng (tên | SL ĐVT) + 2 nút "Hủy" (phụ) | "Điều chuyển" (chính). Xong → toast "Đã điều chuyển n loại vật tư", làm mới màn.

**Lịch sử điều chuyển** (border-top 2px, tiêu đề 17px/800): dòng "{từ} → {đến}" 14px/600 + thời gian phải 12px; danh sách "tên × SL ĐVT, …" 12px; "{mã phiếu} · {người điều phối}" 11px.

## Backend cần bổ sung (Apps Script)
Repo hiện có `xuatTon`, `dieuChuyen(token, A, B, dong)`, `dieuChuyenLichSu`. Cần thêm:
1. `dsCuaHangDong(token)` → `[{maSAP, ten, ngayDong}]` (có thể đọc từ sheet Cửa hàng với cột trạng thái "Đóng cửa").
2. `tonCuaHang(token, maSAP)` → `[[maVT, sl], …]` vật tư còn tại kho cửa hàng.
3. Mở rộng `dieuChuyen` nhận nguồn/đích có loại: `{loai:'NV'|'CH'|'KHO', ma}`; `dong` = `[{maVT, ten, dvt, sl, nhapTay:boolean}]`.
   - Nguồn CH: trừ tồn cửa hàng (dòng nhập tay không trừ, vì CH không có số liệu).
   - Đích KHO: cộng vào tồn kho chính; đích NV: cộng vào sheet Tồn kho của NV.
   - Dòng nhập tay chưa có mã/không có trong danh mục: ghi vào danh mục với cờ "Cần xác minh" hoặc sheet chờ duyệt — **cần chủ app quyết định**.
   - Ghi lịch sử kèm loại nguồn/đích.
4. Quyền: chỉ Đội trưởng/Quản lý gọi được (như hiện tại).

## State Management (bổ sung vào `S`/biến cục bộ view)
- Điều phối: `dcSrc ('nv'|'ch')`, `dcA` (NV nguồn), `dcCH` (mã SAP nhập), `dcB` (đích: maNV hoặc 'KHO'), `qty {maVT: sl}`, `dcVM ('list'|'hand')`, `manual [{ma, ten, dvt, sl}]`, ô nhập tay `mnMa/mnTen/mnDvt/mnSl`, `mnErr`.
- Đổi nguồn → xoá `qty`; đổi CH → xoá `qty`; xác nhận xong → xoá `qty` + `manual`.
- Ngưỡng "sắp hết": cấu hình (mặc định 5) — có thể đưa vào config server cạnh `soNgayCanhBao`.

## Design Tokens
Màu:
- Nền `#f3f2f2` · Bề mặt `#eae9e9` · Chữ/ink `#201e1d` · Divider `rgba(32,30,29,.4)` (ink 40%)
- Accent `#ec3013`; hover `#dd2b0f` (600); pressed/chữ đỏ nhỏ `#ae1800` (700); `#7c1405` (800); nền tag đỏ `#fff2ef` (100)
- Neutral: 100 `#f8f4f4` · 200 `#eae7e7` · 300 `#d7d3d3` · 700 `#605d5d` (chữ phụ) · 800 `#444141`
Spacing: 4 · 8 · 12 · 16 · 24 · 32 px. Lề màn hình 16px (đăng nhập 24px).
Chữ (Archivo): tiêu đề trang 24/800 · số liệu 40/800 · tiêu đề khối 17/800 · nội dung 15/600 & 14/400 · phụ 12–13 · kicker 11/600 uppercase .06–.08em. Số dùng `font-variant-numeric: tabular-nums`.
Radius: 0 mọi nơi.
Shadow: md `0 3px 10px rgba(45,43,43,.16)` (toast) · lg `0 12px 32px rgba(45,43,43,.22)`.
Focus: `outline: 2px solid #ec3013; outline-offset: 2px`. Disabled: opacity .45.

## Assets
- `assets/wincommerce-white.png` — logo WinCommerce bản trắng nền trong suốt (tách từ logo người dùng cung cấp). Nên thay bằng file SVG chính thức nếu có.
- Icon: Lucide (inline SVG, stroke 2, 18–24px). Thay các emoji icon hiện tại (📄 📦 ⌗ ✔ ⇄ 📊 🔔).
- Font: Archivo từ Google Fonts.

## Files
- `Bien Ban Vat Tu.html` — prototype tham chiếu (mở trực tiếp trên trình duyệt). Logic + dữ liệu mẫu nằm trong thẻ `<script data-dc-script>`; markup là template trong `<x-dc>`.
- `assets/wincommerce-white.png`
- `styles.css` — token Modernist (biến CSS) dùng trong prototype.
- File gốc cần sửa trong repo: `index.html` (login ~dòng 1630, nav ~1648, list ~1705, dash ~1790, tồn kho ~2292, điều phối `viewDC` ~2445, form lập mới ~2529, chi tiết ~2677, duyệt ~2751, quét ~2790).
