(function(){
  const TILE = 32;      // base tile pixels
  const SCALE = 3;      // display scale
  const TPX = TILE*SCALE;
  const MAP_W = 12;
  const MAP_H = 8;

  const canvas = document.getElementById('grid');
  const overlay = document.getElementById('overlay');
  const cursorEl = document.getElementById('cursor');
  const partyEl = document.getElementById('party');
  const goalLabel = document.getElementById('goalLabel');
  const logEl = document.getElementById('log');

  const bodyEl = document.body;
  const openingScreen = document.getElementById('openingScreen');
  const prologueScreen = document.getElementById('prologueScreen');
  const startButton = document.getElementById('startButton');
  const beginGameButton = document.getElementById('beginGameButton');

  let gameActive = false;
  let prologueVisible = false;

  const size = { w: MAP_W*TPX, h: MAP_H*TPX };
  canvas.width = size.w; canvas.height = size.h;
  canvas.style.width = size.w+'px'; canvas.style.height = size.h+'px';
  overlay.style.width = size.w+'px'; overlay.style.height = size.h+'px';

  const ctx = canvas.getContext('2d');

  const roadImage = new Image();
  let roadPattern = null;
  roadImage.onload = () => {
    console.log('Road texture loaded successfully');
    const patternCanvas = document.createElement('canvas');
    const patternSize = Math.max(64, TPX * 2);
    patternCanvas.width = patternSize;
    patternCanvas.height = patternSize;
    const pctx = patternCanvas.getContext('2d');
    pctx.drawImage(roadImage, 0, 0, patternSize, patternSize);
    roadPattern = ctx.createPattern(patternCanvas, 'repeat');
    drawBoard();
  };
  roadImage.onerror = () => {
    console.error('Failed to load road texture');
  };
  roadImage.src = 'src/assets/images/tiles/tileset_city_market_road_cobble.png';

  // Define road graph with events and branching paths
  const nodes = [
    {id:0, x:1, y:6, label:'出発'},
    {id:1, x:3, y:6, event:{ type:'info', title:'商人の噂', desc:'前方に山賊が出没しているとの噂があります。' }},
    {id:2, x:5, y:6, event:{ type:'choice', title:'分かれ道', desc:'道が二つに分かれています。どちらへ進みますか？',
      options:[
        {label:'山道（危険だが近道）', effect:'mountain', unlock:[5]},
        {label:'街道（安全だが遠回り）', effect:'road', unlock:[3]}
      ]
    }},
    {id:3, x:7, y:6, event:{ type:'shop', title:'行商人', desc:'アイテムを購入できます。' }},
    {id:4, x:9, y:6, event:{ type:'battle', title:'山賊出現！', desc:'山賊が現れた！' }},
    {id:5, x:5, y:4, locked:true, event:{ type:'battle', title:'崖の山賊', desc:'山道で山賊に遭遇！' }},
    {id:6, x:7, y:4, event:{ type:'choice', title:'関所', desc:'通行料を払いますか？',
      options:[
        {label:'100G払う', effect:'pay', cost:100, unlock:[7]},
        {label:'迂回する', effect:'detour', unlock:[4]}
      ]
    }},
    {id:7, x:9, y:4, label:'取引先', goal:true, locked:true},
    {id:8, x:3, y:4, event:{ type:'treasure', title:'隠し財宝', desc:'隠された財宝を発見！' }},
    {id:9, x:5, y:2, locked:true, event:{ type:'boss', title:'盗賊団のボス', desc:'盗賊団のボスが立ちはだかる！' }}
  ];
  const edges = [
    [0,1],[0,4],             // from home
    [1,2],[1,4],[2,3],       // material gathering routes
    [2,5],[3,6],[3,9],       // to craftsmen
    [4,5],[5,6],[5,7],       // craftsman connections
    [6,7],[6,8],[7,8],       // to market
    [8,9],[9,3]              // market-tavern loop
  ];
  const adj = new Map(nodes.map(n=>[n.id,[]]));
  edges.forEach(([a,b])=>{ adj.get(a).push(b); adj.get(b).push(a); });

  const startId = 0;
  const goalId = 7;
  const state = {
    turn: 1,
    day: 1,
    cash: 300,
    rep: 10,
    cursor: startId,
    party: startId,
    materials: {},     // raw materials inventory
    products: {},      // crafted products inventory
    contracts: [],     // active craft contracts
    unlockedNodes: new Set([...Array(10).keys()]),  // all nodes unlocked
    visitedNodes: new Set([0]),
    currentEvent: null,
    diceRolls: 0      // track dice game attempts
  };

  if (startButton){
    startButton.focus();
    startButton.addEventListener('click', handleOpeningStart);
  }
  if (beginGameButton){
    beginGameButton.addEventListener('click', startGame);
  }

  drawBoard();
  positionAtNode(cursorEl, state.cursor);
  partyEl.style.display = 'none';  // Hide the party emoji
  positionGoal(goalLabel, goalId);
  log('Ready. 道路上のみ移動できます。Helpで説明表示。');

  window.addEventListener('keydown', (e)=>{
    if (!gameActive){
      if (e.key === 'Enter' || e.key === ' '){
        e.preventDefault();
        if (!prologueVisible){
          handleOpeningStart();
        } else {
          startGame();
        }
      }
      return;
    }
    if (e.key === 'h' || e.key === '?' ) { toggleHelp(true); return; }
    const dir = keyToDir(e.key);
    if (dir){
      const next = neighborInDir(state.cursor, dir.dx, dir.dy);
      if (next != null){
        state.cursor = next;
        positionAtNode(cursorEl, state.cursor);
        log(`カーソル: ノード#${state.cursor}`);
      }
      return;
    }
    if (e.key === 'Enter' || e.key === ' '){
      movePartyTo(state.cursor);
    }
  });

  function handleOpeningStart(){
    if (prologueVisible){
      return;
    }
    if (openingScreen && !openingScreen.hidden){
      openingScreen.classList.add('is-hidden');
      setTimeout(()=>{
        if (openingScreen){
          openingScreen.hidden = true;
        }
        showPrologue();
      }, 360);
    } else {
      showPrologue();
    }
  }

  function showPrologue(){
    if (!prologueScreen || prologueVisible){
      return;
    }
    prologueVisible = true;
    prologueScreen.hidden = false;
    prologueScreen.classList.remove('is-hidden');
    prologueScreen.classList.remove('is-active');
    requestAnimationFrame(()=>{
      prologueScreen.classList.add('is-active');
    });
  }

  function startGame(){
    if (gameActive){
      return;
    }
    gameActive = true;
    prologueVisible = false;
    if (prologueScreen){
      prologueScreen.classList.add('is-hidden');
      setTimeout(()=>{
        if (prologueScreen){
          prologueScreen.hidden = true;
          prologueScreen.classList.remove('is-hidden');
          prologueScreen.classList.remove('is-active');
        }
      }, 360);
    }
    if (openingScreen && !openingScreen.hidden){
      openingScreen.hidden = true;
    }
    bodyEl.dataset.gameState = 'play';
  }

  // Help modal
  const helpBtn = document.getElementById('helpBtn');
  const helpModal = document.getElementById('helpModal');
  helpBtn.addEventListener('click', ()=>toggleHelp(true));
  helpModal.addEventListener('click', (e)=>{ if (e.target.dataset.close !== undefined) toggleHelp(false); });
  function toggleHelp(on){ helpModal.hidden = !on; }

  function drawBoard(){
    // background
    ctx.fillStyle = '#0e1118';
    ctx.fillRect(0,0,size.w,size.h);
    // soft vignette/tiles
    for (let y=0;y<MAP_H;y++){
      for (let x=0;x<MAP_W;x++){
        ctx.fillStyle = (x+y)%2? '#0f1420':'#0d1220';
        ctx.fillRect(x*TPX,y*TPX,TPX,TPX);
      }
    }
    // draw roads (edges) using cobblestone texture
    const roadWidth = Math.max(TPX * 0.55, 42);
    edges.forEach(([a,b])=>{
      const A = nodes[a];
      const B = nodes[b];
      const startX = A.x*TPX+TPX/2;
      const startY = A.y*TPX+TPX/2;
      const dx = (B.x - A.x) * TPX;
      const dy = (B.y - A.y) * TPX;
      const len = Math.hypot(dx, dy);
      const angle = Math.atan2(dy, dx);

      ctx.save();
      ctx.translate(startX, startY);
      ctx.rotate(angle);
      ctx.fillStyle = roadPattern || '#3b6ea8';
      ctx.fillRect(0, -roadWidth/2, len, roadWidth);
      ctx.restore();
    });
    // draw nodes
    nodes.forEach(n=>{
      const cx = n.x*TPX+TPX/2, cy = n.y*TPX+TPX/2;
      const isUnlocked = state.unlockedNodes.has(n.id);
      const isVisited = state.visitedNodes.has(n.id);
      
      // Node colors based on state
      if (!isUnlocked){
        ctx.fillStyle = '#2a2a3a';  // locked nodes
      } else if (n.goal){
        ctx.fillStyle = '#c9a227';  // goal
      } else if (n.id === startId){
        ctx.fillStyle = '#4aa56b';  // start
      } else if (isVisited){
        ctx.fillStyle = '#7a6b90';  // visited
      } else if (n.event?.type === 'battle' || n.event?.type === 'boss'){
        ctx.fillStyle = '#c04545';  // danger
      } else if (n.event?.type === 'shop'){
        ctx.fillStyle = '#45a5c0';  // shop
      } else if (n.event?.type === 'treasure'){
        ctx.fillStyle = '#d4af37';  // treasure
      } else {
        ctx.fillStyle = '#5b8cc0';  // normal
      }
      
      ctx.beginPath();
      ctx.arc(cx, cy, Math.max(10, TPX*0.22), 0, Math.PI*2);
      ctx.fill();
      
      // Draw lock icon for locked nodes
      if (!isUnlocked){
        ctx.fillStyle = '#666';
        ctx.font = '16px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('🔒', cx, cy+5);
      }
      
      // Draw event icon
      if (isUnlocked && n.event && !isVisited){
        ctx.fillStyle = '#fff';
        ctx.font = '20px sans-serif';
        ctx.textAlign = 'center';
        const icon = getEventIcon(n.event.type);
        ctx.fillText(icon, cx, cy+5);
      }
      
      if (n.label){
        ctx.fillStyle = '#e8e8f0';
        ctx.font = '12px sans-serif';
        ctx.textAlign='center';
        ctx.fillText(n.label, cx, cy-TPX*0.45);
      }
    });
    // thin grid overlay
    ctx.strokeStyle = '#1f2430';
    ctx.lineWidth = 1;
    for (let x=0; x<=MAP_W; x++){
      const px = x*TPX + 0.5; ctx.beginPath(); ctx.moveTo(px,0); ctx.lineTo(px,size.h); ctx.stroke();
    }
    for (let y=0; y<=MAP_H; y++){
      const py = y*TPX + 0.5; ctx.beginPath(); ctx.moveTo(0,py); ctx.lineTo(size.w,py); ctx.stroke();
    }
  }

  function keyToDir(key){
    if (key==='ArrowLeft') return {dx:-1,dy:0};
    if (key==='ArrowRight')return {dx:1,dy:0};
    if (key==='ArrowUp')   return {dx:0,dy:-1};
    if (key==='ArrowDown') return {dx:0,dy:1};
    return null;
  }

  function neighborInDir(id, dx, dy){
    const here = nodeById(id);
    const neigh = adj.get(id).map(nodeById).filter(n => {
      // Only allow movement to unlocked nodes
      return state.unlockedNodes.has(n.id);
    });
    // prefer neighbor whose delta matches direction sign
    const candidates = neigh.filter(n=>{
      const sx = Math.sign(n.x - here.x);
      const sy = Math.sign(n.y - here.y);
      return (dx!==0 ? sx===dx : sy===dy);
    });
    if (candidates.length>0) return candidates[0].id;
    return null;
  }

  function nodeById(id){ return nodes.find(n=>n.id===id); }

  function positionAtNode(el, nodeId, isToken=false){
    const n = nodeById(nodeId);
    el.style.left = (n.x*TPX) + 'px';
    el.style.top  = (n.y*TPX) + 'px';
    if (!isToken){ el.style.width = TPX+'px'; el.style.height = TPX+'px'; }
  }

  function positionGoal(el, nodeId){
    const n = nodeById(nodeId);
    el.style.left = (n.x*TPX) + 'px';
    el.style.top  = (n.y*TPX - 24) + 'px';
    el.textContent = '取引先';
  }

  function movePartyTo(nodeId){
    state.party = nodeId;
    state.cursor = nodeId;  // Keep cursor and party position in sync
    positionAtNode(cursorEl, state.cursor);
    partyEl.style.display = 'none';  // Hide the party emoji
    const n = nodeById(state.party);
    
    // Always show event dialog when entering a node with an event
    if (n.event){
      showEventDialog(n.event, nodeId);
    }
    
    log(`移動: ${n.label || `ノード#${nodeId}`}`);
    updateStatus();
  }

  function showEventDialog(event, nodeId){
    state.currentEvent = {event, nodeId};
    let modal;
    switch(event.type) {
      case 'material':
        modal = createMaterialModal(event, nodeId);
        break;
      case 'negotiate':
        modal = createNegotiateModal(event, nodeId);
        break;
      case 'sell':
        modal = createSellModal(event, nodeId);
        break;
      case 'dice':
        modal = createDiceModal(event, nodeId);
        break;
      case 'toll':
      case 'choice':
        modal = createEventModal(event, nodeId);
        break;
      default:
        return;
    }
    document.body.appendChild(modal);
  }

  // Material purchase modal
  function createMaterialModal(event, nodeId){
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
      <div class="modal-backdrop" data-close></div>
      <div class="modal-content material-modal">
        <header class="modal-header">
          <h2>${event.title}</h2>
          <button class="modal-close" data-close>&times;</button>
        </header>
        <section class="modal-body">
          <p>${event.desc}</p>
          <div class="status-bar">
            <span>💰 所持金: ${state.cash}G</span>
          </div>
          <div class="material-list">
            ${event.materials.map(mat => `
              <div class="material-row">
                <span>${mat.name}</span>
                <span>在庫: ${mat.stock}</span>
                <button class="buy-btn" data-buy="${mat.name}" data-price="${mat.price}"
                  ${state.cash < mat.price || mat.stock <= 0 ? 'disabled' : ''}>
                  ${mat.price}Gで買う
                </button>
              </div>
            `).join('')}
          </div>
          <div class="inventory">
            <h3>所持原料</h3>
            ${Object.entries(state.materials).map(([name, qty]) => 
              `<span>${name} x${qty}</span>`
            ).join(' ') || '<span>なし</span>'}
          </div>
        </section>
      </div>
    `;
    
    modal.addEventListener('click', (e) => {
      if (e.target.dataset.close !== undefined) {
        modal.remove();
      }
      if (e.target.dataset.buy) {
        buyMaterial(e.target.dataset.buy, parseInt(e.target.dataset.price), nodeId);
        modal.remove();
        showEventDialog(event, nodeId);
      }
    });
    return modal;
  }

  // Negotiate (craft) modal with command battle
  function createNegotiateModal(event, nodeId){
    const canCraft = event.requires.every(req => 
      (state.materials[req.name] || 0) >= req.qty
    );
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
      <div class="modal-backdrop" data-close></div>
      <div class="modal-content negotiate-modal">
        <header class="modal-header">
          <h2>${event.title}との交渉</h2>
          <button class="modal-close" data-close>&times;</button>
        </header>
        <section class="modal-body">
          <p>${event.desc}</p>
          <div class="negotiate-info">
            <div>必要材料: ${event.requires.map(r => `${r.name} x${r.qty}`).join(', ')}</div>
            <div>作成品: ${event.produces.name} (価値: ${event.produces.value}G)</div>
            <div>難易度: ${'⭐'.repeat(event.produces.difficulty)}</div>
          </div>
          ${canCraft ? `
            <div class="battle-commands">
              <h3>交渉コマンド</h3>
              <button class="command-btn" data-action="negotiate">交渉する</button>
              <button class="command-btn" data-action="persuade">説得する（信用消費）</button>
              <button class="command-btn" data-action="bribe">賄賂を渡す（50G）</button>
            </div>
            <div id="battle-result"></div>
          ` : `
            <div class="warning">必要な材料が不足しています</div>
          `}
        </section>
      </div>
    `;
    
    modal.addEventListener('click', (e) => {
      if (e.target.dataset.close !== undefined) {
        modal.remove();
      }
      if (e.target.dataset.action) {
        performNegotiation(e.target.dataset.action, event, modal);
      }
    });
    return modal;
  }

  // Sell modal with negotiation battle
  function createSellModal(event, nodeId){
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
      <div class="modal-backdrop" data-close></div>
      <div class="modal-content sell-modal">
        <header class="modal-header">
          <h2>${event.title}との販売交渉</h2>
          <button class="modal-close" data-close>&times;</button>
        </header>
        <section class="modal-body">
          <p>${event.desc}</p>
          <div class="status-bar">
            <span>💰 所持金: ${state.cash}G</span>
            <span>📊 信用: ${state.rep}</span>
          </div>
          <div class="product-select">
            <h3>販売する商品を選択</h3>
            <select id="product-select">
              <option value="">-- 商品を選択 --</option>
              ${Object.entries(state.products).map(([name, qty]) => {
                const demand = event.demands.find(d => d.name === name);
                if (demand) {
                  return `<option value="${name}" data-price="${demand.price}" data-difficulty="${demand.difficulty || 5}">
                    ${name} x${qty} (基本価格: ${demand.price}G)
                  </option>`;
                }
                return '';
              }).join('')}
            </select>
          </div>
          <div id="sell-negotiation" style="display:none">
            <div class="negotiate-info">
              <div id="selected-product"></div>
              <div id="negotiation-difficulty"></div>
            </div>
            <div class="battle-commands">
              <h3>販売交渉コマンド</h3>
              <button class="command-btn" data-action="pitch">商品の魅力を説明</button>
              <button class="command-btn" data-action="bargain">価格交渉（強気）</button>
              <button class="command-btn" data-action="discount">値引きして売る（-20%）</button>
            </div>
            <div id="sell-result"></div>
          </div>
          <div class="inventory">
            <h3>市場の需要</h3>
            ${event.demands.map(d => 
              `<div>${d.name}: 需要${d.demand} ${'⭐'.repeat(d.difficulty || 5)}</div>`
            ).join('')}
          </div>
        </section>
      </div>
    `;
    
    modal.addEventListener('change', (e) => {
      if (e.target.id === 'product-select') {
        const selected = e.target.value;
        const option = e.target.selectedOptions[0];
        if (selected) {
          const price = parseInt(option.dataset.price);
          const difficulty = parseInt(option.dataset.difficulty);
          modal.querySelector('#selected-product').textContent = `商品: ${selected}`;
          modal.querySelector('#negotiation-difficulty').textContent = `交渉難易度: ${'⭐'.repeat(difficulty)}`;
          modal.querySelector('#sell-negotiation').style.display = 'block';
        } else {
          modal.querySelector('#sell-negotiation').style.display = 'none';
        }
      }
    });
    
    modal.addEventListener('click', (e) => {
      if (e.target.dataset.close !== undefined) {
        modal.remove();
      }
      if (e.target.dataset.action) {
        const select = modal.querySelector('#product-select');
        const product = select.value;
        const price = parseInt(select.selectedOptions[0].dataset.price);
        const difficulty = parseInt(select.selectedOptions[0].dataset.difficulty);
        performSellNegotiation(e.target.dataset.action, product, price, difficulty, modal);
      }
    });
    return modal;
  }

  // Dice game modal
  function createDiceModal(event, nodeId){
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
      <div class="modal-backdrop" data-close></div>
      <div class="modal-content dice-modal">
        <header class="modal-header">
          <h2>${event.title}</h2>
          <button class="modal-close" data-close>&times;</button>
        </header>
        <section class="modal-body">
          <p>${event.desc}</p>
          <div class="status-bar">
            <span>💰 所持金: ${state.cash}G</span>
          </div>
          <div class="dice-game">
            <button class="dice-btn" data-play="true" ${state.cash < 50 ? 'disabled' : ''}>
              🎲 サイコロを振る (50G)
            </button>
            <div id="dice-result"></div>
          </div>
        </section>
      </div>
    `;
    
    modal.addEventListener('click', (e) => {
      if (e.target.dataset.close !== undefined) {
        modal.remove();
      }
      if (e.target.dataset.play && state.cash >= 50) {
        playDiceGame(modal);
      }
    });
    return modal;
  }

  // Helper functions for game mechanics
  function buyMaterial(name, price, nodeId){
    if (state.cash >= price) {
      state.cash -= price;
      state.materials[name] = (state.materials[name] || 0) + 1;
      
      const node = nodeById(nodeId);
      const mat = node.event.materials.find(m => m.name === name);
      if (mat) mat.stock--;
      
      log(`${name}を${price}Gで購入`);
      updateStatus();
    }
  }

  function performNegotiation(action, event, modal){
    const difficulty = event.produces.difficulty;
    let success = false;
    let message = '';
    
    if (action === 'negotiate') {
      const roll = Math.floor(Math.random() * 10) + 1;
      success = roll + state.rep/10 > difficulty;
      message = `サイコロ: ${roll} + 信用ボーナス: ${Math.floor(state.rep/10)} = ${roll + Math.floor(state.rep/10)}\n`;
      message += success ? '✅ 交渉成功！' : '❌ 交渉失敗...もう一度試してみよう';
    } else if (action === 'persuade' && state.rep >= 5) {
      state.rep -= 5;
      success = Math.random() > 0.3;
      message = success ? '✅ 説得成功！信用を使いました' : '❌ 説得失敗...信用を5失いました';
    } else if (action === 'bribe' && state.cash >= 50) {
      state.cash -= 50;
      success = true;
      message = '✅ 賄賂で成功！50G支払いました';
    }
    
    if (success) {
      event.requires.forEach(req => {
        state.materials[req.name] -= req.qty;
        if (state.materials[req.name] <= 0) delete state.materials[req.name];
      });
      state.products[event.produces.name] = (state.products[event.produces.name] || 0) + 1;
      message += `\n${event.produces.name}を作成しました！`;
      state.rep += 2;
    }
    
    const resultDiv = modal.querySelector('#battle-result');
    resultDiv.innerHTML = `<div class="battle-message">${message}</div>`;
    updateStatus();
    
    if (success) {
      setTimeout(() => modal.remove(), 2000);
    }
  }

  function performSellNegotiation(action, product, basePrice, difficulty, modal){
    let success = false;
    let finalPrice = basePrice;
    let message = '';
    
    if (action === 'pitch') {
      const roll = Math.floor(Math.random() * 10) + 1;
      const bonus = Math.floor(state.rep / 10);
      success = roll + bonus > difficulty;
      message = `サイコロ: ${roll} + 信用ボーナス: ${bonus} = ${roll + bonus}\n`;
      if (success) {
        finalPrice = Math.floor(basePrice * 1.2);
        message += `✅ 交渉大成功！20%高く売れました！\n${product}を${finalPrice}Gで販売`;
      } else {
        message += '❌ 相手は興味を示さなかった...もう一度試してみよう';
      }
    } else if (action === 'bargain') {
      const roll = Math.floor(Math.random() * 10) + 1;
      success = roll > difficulty - 2;
      message = `強気の交渉: サイコロ ${roll}\n`;
      if (success) {
        finalPrice = Math.floor(basePrice * 1.5);
        message += `✅ 強気が功を奏した！50%高く売れた！\n${product}を${finalPrice}Gで販売`;
      } else {
        message += '❌ 強気すぎて交渉決裂...相手は去ってしまった';
        modal.querySelector('.battle-commands').style.display = 'none';
      }
    } else if (action === 'discount') {
      success = true;
      finalPrice = Math.floor(basePrice * 0.8);
      message = `✅ 値引きして即決！\n${product}を${finalPrice}Gで販売`;
    }
    
    if (success) {
      state.cash += finalPrice;
      state.products[product]--;
      if (state.products[product] <= 0) delete state.products[product];
      state.rep += Math.floor(finalPrice / 100);
      setTimeout(() => modal.remove(), 2000);
    }
    
    const resultDiv = modal.querySelector('#sell-result');
    resultDiv.innerHTML = `<div class="battle-message">${message}</div>`;
    updateStatus();
  }

  function playDiceGame(modal){
    state.cash -= 50;
    const roll1 = Math.floor(Math.random() * 6) + 1;
    const roll2 = Math.floor(Math.random() * 6) + 1;
    const total = roll1 + roll2;
    let prize = 0;
    let message = `🎲 ${roll1} + ${roll2} = ${total}\n`;
    
    if (total === 12) {
      prize = 500;
      message += '⭐ 大当たり！500G獲得！';
    } else if (total >= 10) {
      prize = 150;
      message += '🎉 当たり！150G獲得！';
    } else if (total >= 7) {
      prize = 50;
      message += '📍 引き分け。50G返却';
    } else {
      message += '💔 はずれ...また挑戦してね';
    }
    
    state.cash += prize;
    state.diceRolls++;
    
    const resultDiv = modal.querySelector('#dice-result');
    resultDiv.innerHTML = `<div class="dice-message">${message}</div>`;
    updateStatus();
  }

  function createEventModal(event, nodeId){
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
      <div class="modal-backdrop" data-close></div>
      <div class="modal-content event-modal" role="dialog" aria-modal="true">
        <header class="modal-header">
          <h2>${event.title}</h2>
        </header>
        <section class="modal-body">
          <p>${event.desc}</p>
          ${event.type === 'choice' ? createChoiceButtons(event.options, nodeId) : ''}
          ${event.type !== 'choice' ? '<button class="modal-action-btn" data-close>了解</button>' : ''}
        </section>
      </div>
    `;
    
    modal.addEventListener('click', (e)=>{
      if (e.target.dataset.close !== undefined){
        modal.remove();
        state.currentEvent = null;
      }
      if (e.target.dataset.choice !== undefined){
        handleChoice(parseInt(e.target.dataset.choice), nodeId);
        modal.remove();
        state.currentEvent = null;
      }
    });
    
    return modal;
  }

  function createChoiceButtons(options, nodeId){
    return '<div class="choice-buttons">' + 
      options.map((opt, i) => {
        const disabled = opt.cost && state.cash < opt.cost;
        return `<button class="choice-btn" data-choice="${i}" ${disabled?'disabled':''}>
          ${opt.label}${opt.cost ? ` (${opt.cost}G)` : ''}
        </button>`;
      }).join('') + 
      '</div>';
  }

  function handleChoice(choiceIndex, nodeId){
    const event = state.currentEvent.event;
    const option = event.options[choiceIndex];
    
    if (option.cost){
      state.cash -= option.cost;
    }
    
    if (option.unlock){
      option.unlock.forEach(id => {
        state.unlockedNodes.add(id);
        log(`新しいルートが解放されました！`);
      });
    }
    
    log(`選択: ${option.label}`);
    updateStatus();
    drawBoard();
  }

  function updateStatus(){
    document.getElementById('status-turn').textContent = `Turn: ${state.turn}`;
    document.getElementById('status-cash').textContent = `Cash: ${state.cash}`;
    document.getElementById('status-rep').textContent = `Rep: ${state.rep}`;
  }

  function log(msg){
    const time = new Date().toLocaleTimeString();
    logEl.textContent += `[${time}] ${msg}\n`;
    logEl.scrollTop = logEl.scrollHeight;
  }
  function getEventIcon(type){
    const icons = {
      battle: '⚔️',
      boss: '👹',
      shop: '🛒',
      treasure: '💎',
      choice: '❓',
      info: 'ℹ️'
    };
    return icons[type] || '❓';
  }

})();
