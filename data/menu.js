/* =========================================================
   メニュー
   ・ここを書き換えると「メニューページ」が変わります。TOPの Menu に出す料金は、このファイルの一番下の MENU_TOP です。
   ・カテゴリ（Signature、Food など）ごとに品目を並べます。
   ・price は数字で書くと「¥1,200」の形で表示されます（例: 1200）。
     「¥600〜」のように書きたいときは "¥600〜" と文字で書きます。
   ・text（説明）は不要なら "" のままで大丈夫です。
   ・1品分は { から }, まで。コピーして増やせます。最後の , を消さないでください。

   ※ 現在入っているのは見本のデータです。公開前に実際のメニューと価格に書き換えてください。
   ========================================================= */
window.MENU = [
  {
    en: "Signature", jp: "看板ドリンク",
    items: [
      { name: "傷跡のロゼ", en: "Scar Rosé", price: 1200, text: "ロゼに木苺のシロップを一筋。グラスの縁に、猫の爪痕を描きます。" },
      { name: "月蝕ソーダ", en: "Eclipse Soda", price: 1000, text: "ブラックベリーと炭のソーダ。注ぐと、底から赤い月が昇ります。" },
      { name: "黒猫の毒林檎", en: "Poison Apple", price: 1100, text: "青林檎とカシスのノンアルコール。甘くて、少しだけ危険な味。" },
      { name: "鮮血のミルクティー", en: "Bloody Milk Tea", price: 1100, text: "苺のソースを沈めたロイヤルミルクティー。混ぜるほど、赤く染まります。" },
    ],
  },
  {
    en: "Drink", jp: "ドリンク",
    items: [
      { name: "夜明け前の紅茶", en: "Before Dawn Tea", price: 700, text: "ホット／アイス" },
      { name: "黒猫ブレンド", en: "Black Cat Blend Coffee", price: 700, text: "ホット／アイス" },
      { name: "ソフトドリンク", en: "Soft Drinks", price: 600, text: "コーラ、ジンジャーエール、オレンジ、烏龍茶" },
    ],
  },
  {
    en: "Food", jp: "フード",
    items: [
      { name: "黒猫オムライス", en: "Black Cat Omelette Rice", price: 1500, text: "担当キャストがケチャップで絵を描きます。" },
      { name: "逆襲のブラックカレー", en: "Revenge Curry", price: 1300, text: "" },
      { name: "十字架のホットサンド", en: "Cross Hot Sandwich", price: 1000, text: "" },
      { name: "真夜中のポテト", en: "Midnight Fries", price: 800, text: "" },
    ],
  },
  {
    en: "Dessert", jp: "デザート",
    items: [
      { name: "薔薇と十字架のパフェ", en: "Rose & Cross Parfait", price: 1400, text: "" },
      { name: "爪痕のガトーショコラ", en: "Claw Mark Gâteau", price: 900, text: "粉糖で、三本の爪痕を。" },
      { name: "黒猫のアイス", en: "Black Cat Ice", price: 600, text: "" },
    ],
  },
  {
    en: "Cheki", jp: "チェキ・オリジナル",
    items: [
      { name: "キャストとチェキ", en: "Cheki with Cast", price: 1000, text: "落書き・デコレーション付き。" },
      { name: "キャストのソロチェキ", en: "Solo Cheki", price: 800, text: "" },
      { name: "オリジナルドリンク（キャスト指名）", en: "Cast Original", price: 1500, text: "" },
    ],
  },
];

/* =========================================================
   TOPページの「Menu」で、写真の横に出す料金
   ・price は数字で書くと「¥1,200」、文字で書くとそのまま表示されます（例: "¥800〜"）。
   ・note（小さな注意書き）は不要なら "" にします。
   ========================================================= */
window.MENU_TOP = {
  title: "1時間飲み放題",
  en: "Free Flow",
  items: [
    { name: "アルコール", en: "Alcohol", price: 2500, text: "" },
    { name: "ソフトドリンク", en: "Soft Drinks", price: 2000, text: "" },
  ],
  note: "料金は1時間あたりです。",
};
