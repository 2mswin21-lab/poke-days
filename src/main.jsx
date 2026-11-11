import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { createClient } from '@supabase/supabase-js';
import { ArrowDown, ArrowRight, Check, ChevronDown, Heart, Menu, Minus, Plus, Search, ShoppingBag, Sparkles, Trash2, X } from 'lucide-react';
import './style.css';

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const supabase = url && key ? createClient(url, key) : null;
const art = (id) => `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
const won = (price) => `${Number(price).toLocaleString('ko-KR')}원`;
const categories = ['전체', '인형', '키링', '피규어', '문구', '잡화'];

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [category, setCategory] = useState('전체');
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('추천순');
  const [favorites, setFavorites] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem('poke-days-cart') || '{}'); } catch { return {}; }
  });
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    async function load() {
      if (!supabase) { setError('Supabase 연결 설정이 필요해요.'); setLoading(false); return; }
      const { data, error: fetchError } = await supabase.from('products').select('*').order('sort_order');
      if (fetchError) setError('상품을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.');
      else setProducts(data || []);
      setLoading(false);
    }
    load();
  }, []);
  useEffect(() => { localStorage.setItem('poke-days-cart', JSON.stringify(cart)); }, [cart]);

  const visible = useMemo(() => {
    const result = products.filter((p) => (category === '전체' || p.category === category) && p.name.toLowerCase().includes(query.trim().toLowerCase()) && (!showFavorites || favorites.includes(p.id)));
    if (sort === '낮은 가격순') result.sort((a, b) => a.price - b.price);
    if (sort === '높은 가격순') result.sort((a, b) => b.price - a.price);
    return result;
  }, [products, category, query, sort, showFavorites, favorites]);
  const count = Object.values(cart).reduce((sum, amount) => sum + amount, 0);
  const total = products.reduce((sum, product) => sum + product.price * (cart[product.id] || 0), 0);
  const updateCart = (id, amount) => setCart((current) => {
    const next = { ...current, [id]: (current[id] || 0) + amount };
    if (next[id] <= 0) delete next[id];
    return next;
  });
  const toggleFavorite = (id) => setFavorites((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  const scrollToShop = () => document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' });
  const chooseCategory = (item) => { setCategory(item); setShowFavorites(false); setMenuOpen(false); scrollToShop(); };

  return <>
    <div className="announcement">작은 행복을 선물해요 <span>✦</span> 포케데이즈에 오신 걸 환영합니다!</div>
    <header className="header">
      <div className="header-inner">
        <button className="mobile-menu icon-btn" aria-label="메뉴 열기" onClick={() => setMenuOpen(!menuOpen)}><Menu size={22} /></button>
        <a className="logo" href="#top" aria-label="포케데이즈 홈"><span className="logo-ball"><i /></span>POKE<span>DAYS</span><small>GOOD DAYS WITH POKÉMON</small></a>
        <nav className={menuOpen ? 'nav open' : 'nav'} aria-label="메인 메뉴">
          <button onClick={() => chooseCategory('전체')}>전체상품</button><button onClick={() => chooseCategory('인형')}>인형</button><button onClick={() => chooseCategory('키링')}>키링</button><button onClick={() => chooseCategory('피규어')}>피규어</button><button onClick={() => chooseCategory('잡화')}>라이프스타일</button>
        </nav>
        <div className="header-actions"><button className="icon-btn search-shortcut" aria-label="상품 검색" onClick={() => { scrollToShop(); document.getElementById('search')?.focus(); }}><Search size={21} /></button><button className="icon-btn" aria-label="찜한 상품 보기" onClick={() => { setShowFavorites(!showFavorites); setCategory('전체'); scrollToShop(); }}><Heart size={21} fill={showFavorites ? '#ed5b48' : 'none'} /></button><button className="icon-btn bag-icon" aria-label={`장바구니 ${count}개`} onClick={() => setCartOpen(true)}><ShoppingBag size={21} /><span>{count}</span></button></div>
      </div>
    </header>
    <main id="top">
      <section className="hero">
        <div className="hero-content"><div className="hero-copy"><span className="eyebrow"><span className="mini-star">✦</span> YOUR EVERYDAY POKÉMON</span><h1>좋아하는 마음을<br /><em>일상 가까이.</em></h1><p>보기만 해도 기분 좋아지는 순간,<br />좋아하는 포켓몬과 함께 만들어보세요.</p><button className="hero-button" onClick={scrollToShop}>나의 굿즈 찾기 <ArrowRight size={18} /></button><div className="hero-note"><span className="little-ball">✦</span> EVERY DAY IS A GOOD DAY!</div></div>
          <div className="hero-art"><div className="hero-ring ring-one" /><div className="hero-ring ring-two" /><span className="spark spark-one">✦</span><span className="spark spark-two">✳</span><span className="spark spark-three">✦</span><span className="hero-sticker">HELLO!<br /><b>PIKACHU</b> ♥</span><img src={art(25)} alt="피카츄 일러스트" /><div className="hero-side-text">A LITTLE HAPPINESS FOR YOU&nbsp; ✦ &nbsp;POKE DAYS</div></div>
        </div><div className="hero-bottom"><span>01 <b>/</b> 01</span><span className="hero-line" /><span>SCROLL TO EXPLORE <ArrowDown size={14} /></span></div>
      </section>
      <section className="perks"><div><span>✳</span><p><b>매일 만나는 작은 행복</b><small>좋아하는 친구와 함께하는 일상</small></p></div><div><span>♡</span><p><b>마음을 담은 셀렉션</b><small>소장하고 싶은 귀여운 아이템</small></p></div><div><span>☺</span><p><b>선물하기 좋은 순간</b><small>소중한 사람에게 전하는 기쁨</small></p></div></section>
      <section className="shop" id="shop"><div className="section-heading"><div><div className="section-label"><span>✦</span> FIND YOUR FAVORITE</div><h2>마음에 쏙 드는 친구를 만나보세요<span>.</span></h2><p>당신의 하루를 더 특별하게 만들어 줄 포켓몬 굿즈</p></div><div className="heading-doodle">GOOD<br /><strong>DAY!</strong><span>✳</span></div></div>
        <div className="shop-controls"><div className="filters" aria-label="상품 카테고리">{categories.map((item) => <button key={item} className={category === item && !showFavorites ? 'active' : ''} onClick={() => { setCategory(item); setShowFavorites(false); }}>{item}</button>)}<button className={showFavorites ? 'active' : ''} onClick={() => setShowFavorites(!showFavorites)}>찜한 상품 ♡</button></div><label className="search-field"><Search size={18} /><input id="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="어떤 친구를 찾고 있나요?" aria-label="상품 검색" />{query && <button onClick={() => setQuery('')} aria-label="검색어 지우기"><X size={15} /></button>}</label></div>
        <div className="results-line"><span>{showFavorites ? '찜한 상품' : '전체 상품'} <b>{visible.length}</b></span><label className="sort"><select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="상품 정렬"><option>추천순</option><option>낮은 가격순</option><option>높은 가격순</option></select><ChevronDown size={14} /></label></div>
        {loading ? <div className="empty">친구들을 데려오는 중이에요 ✦</div> : error ? <div className="empty">{error}</div> : visible.length === 0 ? <div className="empty">찾으시는 상품이 없어요. 다른 친구를 찾아볼까요?</div> : <div className="product-grid">{visible.map((p) => <article className="product" key={p.id}><div className="product-image" style={{ background: p.background }}><span className="image-pattern">✳</span>{p.badge && <span className={`badge ${p.badge === 'NEW' ? 'new' : ''}`}>{p.badge}</span>}<button className="favorite" aria-label={`${p.name} 찜 ${favorites.includes(p.id) ? '취소' : '하기'}`} onClick={() => toggleFavorite(p.id)}><Heart size={19} fill={favorites.includes(p.id) ? '#ed5b48' : 'none'} color={favorites.includes(p.id) ? '#ed5b48' : '#777'} /></button><img src={art(p.pokemon_id)} alt={`${p.name} 캐릭터 이미지`} loading="lazy" /><button className="quick-add" aria-label={`${p.name} 장바구니 담기`} onClick={() => updateCart(p.id, 1)}><Plus size={19} /></button></div><div className="product-meta"><span>{p.category.toUpperCase()} <i>✦</i> POKE DAYS</span><h3>{p.name}</h3><div className="price">{p.original_price && <strong>{Math.round((1 - p.price / p.original_price) * 100)}%</strong>}<b>{won(p.price)}</b> {p.original_price && <del>{won(p.original_price)}</del>}</div><div className="product-bottom"><span>♥ &nbsp;사랑스러운 일상의 친구</span><button onClick={() => updateCart(p.id, 1)}>담기 <Plus size={13} /></button></div></div></article>)}</div>}
      </section>
      <section className="end-banner"><div><span>✦ &nbsp; LITTLE THINGS, BIG SMILES</span><h2>오늘도 귀여움 한 스푼!</h2><p>좋아하는 것들로 채우는 나만의 하루</p></div><div className="end-art"><img src={art(133)} alt="이브이 일러스트" /><span>♡</span></div><button onClick={scrollToShop}>귀여움 더 구경하기 <ArrowRight size={17} /></button></section>
    </main>
    <footer><div className="footer-inner"><div><a className="logo footer-logo" href="#top"><span className="logo-ball"><i /></span>POKE<span>DAYS</span></a><p>좋아하는 마음이 일상이 되는 곳.<br />매일의 작은 행복을 함께해요.</p></div><div className="footer-right"><b>POKE DAYS</b><p>본 사이트는 학습용 데모입니다. 실제 상품 판매 및 결제는 제공하지 않습니다.</p><p>포켓몬 캐릭터 및 관련 상표의 권리는 각 권리자에게 있습니다.</p><small>© 2026 POKE DAYS. DEMO ONLY.</small></div></div></footer>
    {cartOpen && <div className="overlay" onClick={() => setCartOpen(false)}><aside className="cart-panel" onClick={(e) => e.stopPropagation()} aria-label="장바구니"><div className="cart-heading"><div><span>YOUR LITTLE JOYS ✦</span><h2>장바구니 <small>{count}</small></h2></div><button className="icon-btn" aria-label="장바구니 닫기" onClick={() => setCartOpen(false)}><X /></button></div><div className="cart-items">{count === 0 ? <div className="cart-empty"><ShoppingBag size={38} /><p>장바구니가 비어 있어요.</p><span>마음에 드는 친구를 담아보세요!</span></div> : products.filter((p) => cart[p.id]).map((p) => <div className="cart-item" key={p.id}><div className="cart-thumb" style={{ background: p.background }}><img src={art(p.pokemon_id)} alt="" /></div><div className="cart-item-info"><b>{p.name}</b><span>{won(p.price)}</span><div className="quantity"><button onClick={() => updateCart(p.id, -1)} aria-label="수량 줄이기"><Minus size={13} /></button><span>{cart[p.id]}</span><button onClick={() => updateCart(p.id, 1)} aria-label="수량 늘리기"><Plus size={13} /></button></div></div><button className="remove" aria-label={`${p.name} 삭제`} onClick={() => updateCart(p.id, -cart[p.id])}><Trash2 size={17} /></button></div>)}</div><div className="cart-footer"><div><span>상품 합계</span><b>{won(total)}</b></div><button disabled><Check size={17} /> 데모 사이트 · 결제 준비 중</button><p>실제 주문 및 결제는 진행되지 않습니다.</p></div></aside></div>}
  </>;
}

createRoot(document.getElementById('root')).render(<App />);
