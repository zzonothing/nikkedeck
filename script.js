let draggedElement = null;
let draggedFromDeck = null;
let draggedFromSlot = null;
let draggedFromPool = false;
let draggedOriginalParent = null;
let draggedPlaceholder = null;
let dropIndicator = null;

// Touch support variables
let touchStartPos = null;
let touchTarget = null;
let isTouchDragging = false;
let touchDropTarget = null;
let dragGhost = null;

// Click vs Drag detection variables
let mouseDownTime = 0;
let mouseDownPos = null;
let isDragging = false;

// Burst filter state
let activeBurstFilters = new Set(); // Empty set means show all

// Search state
let currentSearchTerm = '';

// Attribute mapping (Korean to icon)
const ATTRIBUTE_ICONS = {
    '전격': 'images/icon-code-electronic.webp',
    '작열': 'images/icon-code-fire.webp',
    '철갑': 'images/icon-code-iron.webp',
    '수냉': 'images/icon-code-water.webp',
    '풍압': 'images/icon-code-wind.webp'
};

// CHARACTER DATA - 여기에서 캐릭터별 정보를 설정하세요
const CHARACTER_DATA = {
    '015': { name: '아니스 : 스파클링 서머', subName: '수니스', attribute: '전격', rarity: 'SSR', manufacturer: '테트라', class: '지원형', weapon: 'SG', burst: '3' },
    '016': { name: '라피 : 레드 후드', subName: '라피', attribute: '작열', rarity: 'SSR', manufacturer: '', class: '', weapon: '', burst: '3' },
    '030': { name: '폴리', subName: '폴리', attribute: '수냉', rarity: 'SSR', manufacturer: '', class: '', weapon: '', burst: '2' },
    '032': { name: '미란다', subName: '미란다', attribute: '작열', rarity: 'SSR', manufacturer: '', class: '', weapon: '', burst: '1' },
    '040': { name: 'D', subName: 'D', attribute: '풍압', rarity: 'SSR', manufacturer: '', class: '', weapon: '', burst: '3' },
    '043': { name: 'D : 킬러 와이프', subName: '동디', attribute: '작열', rarity: 'SSR', manufacturer: '', class: '', weapon: '', burst: '1' },
    '070': { name: '브리드', subName: '브리드', attribute: '수냉', rarity: 'SSR', manufacturer: '', class: '', weapon: '', burst: '3' },
    '072': { name: '디젤', subName: '디젤', attribute: '풍압', rarity: 'SSR', manufacturer: '', class: '', weapon: '', burst: '2' },
    '080': { name: '센티', subName: '센티', attribute: '철갑', rarity: 'SSR', manufacturer: '', class: '', weapon: '', burst: '2' },
    '082': { name: '리타', subName: '리타', attribute: '철갑', rarity: 'SSR', manufacturer: '', class: '', weapon: '', burst: '1' },
    '090': { name: '엠마', subName: '엠마', attribute: '작열', rarity: 'SSR', manufacturer: '', class: '', weapon: '', burst: '1' },
    '092': { name: '은화', subName: '은화', attribute: '작열', rarity: 'SSR', manufacturer: '', class: '', weapon: '', burst: '2' },
    '093': { name: '엠마 : 택티컬 업', subName: '엠마', attribute: '작열', rarity: 'SSR', manufacturer: '', class: '', weapon: '', burst: '1' },
    '094': { name: '베스티 : 택티컬 업', subName: '베스티', attribute: '작열', rarity: 'SSR', manufacturer: '', class: '', weapon: '', burst: '3' },
    '095': { name: '은화 : 택티컬 업', subName: '은화', attribute: '작열', rarity: 'SSR', manufacturer: '', class: '', weapon: '', burst: '2' },
    '100': { name: '라플라스', subName: '라플라스', attribute: '철갑', rarity: 'SSR', manufacturer: '', class: '', weapon: '', burst: '3' },
    '101': { name: '드레이크', subName: '드레이크', attribute: '작열', rarity: 'SSR', manufacturer: '', class: '', weapon: '', burst: '3' },
    '102': { name: '맥스웰', subName: '맥스웰', attribute: '철갑', rarity: 'SSR', manufacturer: '', class: '', weapon: '', burst: '3' },
    '110': { name: '크로우', subName: '크로우', attribute: '작열', rarity: 'SSR', manufacturer: '', class: '', weapon: '', burst: '3' },
    '112': { name: '바이퍼', subName: '바이퍼', attribute: '수냉', rarity: 'SSR', manufacturer: '', class: '', weapon: '', burst: '2' },
    '121': { name: '앤 : 미라클 페어리', subName: '클앤', attribute: '풍압', rarity: 'SSR', manufacturer: '', class: '', weapon: '', burst: '2' },
    '132': { name: '메어리 : 베이 갓데스', subName: '수어리', attribute: '수냉', rarity: 'SSR', manufacturer: '', class: '', weapon: '', burst: '1' },
    '162': { name: '미하라 : 본딩 체인', subName: '미하라', attribute: '작열', rarity: 'SSR', manufacturer: '', class: '', weapon: '', burst: '3' },
    '170': { name: '프리바티', subName: '프리바티', attribute: '수냉', rarity: 'SSR', manufacturer: '', class: '', weapon: '', burst: '3' },
    '171': { name: '율하', subName: '율하', attribute: '작열', rarity: 'SSR', manufacturer: '', class: '', weapon: '', burst: '3' },
    '172': { name: '애드미', subName: '애드미', attribute: '풍압', rarity: 'SSR', manufacturer: '', class: '', weapon: '', burst: '2' },
    '180': { name: '길로틴', subName: '길로틴', attribute: '전격', rarity: 'SSR', manufacturer: '', class: '', weapon: '', burst: '3' },
    '182': { name: '길로틴 : 윈터 슬레이어', subName: '클로틴', attribute: '수냉', rarity: 'SSR', manufacturer: '', class: '', weapon: '', burst: '3' },
    '183': { name: '메이든 : 아이스 로즈', subName: '클이든', attribute: '전격', rarity: 'SSR', manufacturer: '', class: '', weapon: '', burst: '3' },
    '191': { name: '앨리스', subName: '앨리스', attribute: '작열', rarity: 'SSR', manufacturer: '', class: '', weapon: '', burst: '3' },
    '192': { name: '토브', subName: '토브', attribute: '수냉', rarity: 'SSR', manufacturer: '', class: '', weapon: '', burst: '1' },
    '194': { name: '루드밀라 : 윈터 오너', subName: '클루드', attribute: '수냉', rarity: 'SSR', manufacturer: '', class: '', weapon: '', burst: '3' },
    '195': { name: '앨리스 : 원더랜드', subName: '바리스', attribute: '수냉', rarity: 'SSR', manufacturer: '', class: '', weapon: '', burst: '1' },
    '202': { name: '도라', subName: '도라', attribute: '풍압', rarity: 'SSR', manufacturer: '', class: '', weapon: '', burst: '2' },
    '210': { name: '엑시아', subName: '엑시아', attribute: '전격', rarity: 'SSR', manufacturer: '', class: '', weapon: '', burst: '1' },
    '212': { name: '노벨', subName: '노벨', attribute: '철갑', rarity: 'SSR', manufacturer: '', class: '', weapon: '', burst: '2' },
    '220': { name: '스노우 화이트', subName: '스화', attribute: '철갑', rarity: 'SSR', manufacturer: '', class: '', weapon: '', burst: '3' },
    '221': { name: '라푼젤', subName: '라푼젤', attribute: '풍압', rarity: 'SSR', manufacturer: '', class: '', weapon: '', burst: '1' },
    '222': { name: '홍련', subName: '홍련', attribute: '전격', rarity: 'SSR', manufacturer: '', class: '', weapon: '', burst: '3' },
    '224': { name: '스노우 화이트 : 이노센트 데이즈', subName: '애기스화', attribute: '철갑', rarity: 'SSR', manufacturer: '', class: '', weapon: '', burst: '3' },
    '225': { name: '홍련 : 흑영', subName: '흑영', attribute: '풍압', rarity: 'SSR', manufacturer: '', class: '', weapon: '', burst: '3' },
    '231': { name: '이사벨', subName: '이사벨', attribute: '전격', rarity: 'SSR', manufacturer: '', class: '', weapon: '', burst: '3' },
    '232': { name: '노아', subName: '노아', attribute: '풍압', rarity: 'SSR', manufacturer: '', class: '', weapon: '', burst: '2' },
    '233': { name: '도로시', subName: '도로시', attribute: '수냉', rarity: 'SSR', manufacturer: '', class: '', weapon: '', burst: '1' },
    '234': { name: '도로시 : 세렌디피티', subName: '수로시', attribute: '수냉', rarity: 'SSR', manufacturer: '', class: '', weapon: '', burst: '3' },
    '241': { name: '에피넬', subName: '에피넬', attribute: '풍압', rarity: 'SSR', manufacturer: '', class: '', weapon: '', burst: '3' },
    '260': { name: '모더니아', subName: '모더니아', attribute: '작열', rarity: 'SSR', manufacturer: '', class: '', weapon: '', burst: '3' },
    '270': { name: '블랑', subName: '블랑', attribute: '풍압', rarity: 'SSR', manufacturer: '', class: '', weapon: '', burst: '2' },
    '271': { name: '누아르', subName: '누아르', attribute: '풍압', rarity: 'SSR', manufacturer: '', class: '', weapon: '', burst: '3' },
    '272': { name: '루주', subName: '루주', attribute: '전격', rarity: 'SSR', manufacturer: '', class: '', weapon: '', burst: '1' },
    '283': { name: '로산나 : 시크 오션', subName: '수산나', attribute: '풍압', rarity: 'SSR', manufacturer: '', class: '', weapon: '', burst: '2' },
    '284': { name: '사쿠라 : 블룸 인 서머', subName: '수쿠라', attribute: '풍압', rarity: 'SSR', manufacturer: '', class: '', weapon: '', burst: '3' },
    '290': { name: '마나', subName: '마나', attribute: '풍압', rarity: 'SSR', manufacturer: '', class: '', weapon: '', burst: '3' },
    '310': { name: '에이드', subName: '에이드', attribute: '풍압', rarity: 'SSR', manufacturer: '', class: '', weapon: '', burst: '2' },
    '311': { name: '코코아', subName: '코코아', attribute: '작열', rarity: 'SSR', manufacturer: '', class: '', weapon: '', burst: '1' },
    '312': { name: '소다', subName: '소다', attribute: '작열', rarity: 'SSR', manufacturer: '', class: '', weapon: '', burst: '1' },
    '313': { name: '프리바티 : 언카인드 메이드', subName: '메프바', attribute: '전격', rarity: 'SSR', manufacturer: '', class: '', weapon: '', burst: '3' },
    '314': { name: '소다 : 트윙클링 바니', subName: '바소다', attribute: '철갑', rarity: 'SSR', manufacturer: '', class: '', weapon: '', burst: '3' },
    '321': { name: '마르차나', subName: '마르차나', attribute: '철갑', rarity: 'SSR', manufacturer: '', class: '', weapon: '', burst: '2' },
    '330': { name: '크라운', subName: '크라운', attribute: '철갑', rarity: 'SSR', manufacturer: '', class: '', weapon: '', burst: '2' },
    '352': { name: '헬름', subName: '헬름', attribute: '수냉', rarity: 'SSR', manufacturer: '', class: '', weapon: '', burst: '3' },
    '353': { name: '헬름 : 아쿠아마린', subName: '수헬름', attribute: '철갑', rarity: 'SSR', manufacturer: '', class: '', weapon: '', burst: '2' },
    '354': { name: '마스트 : 로망틱 메이드', subName: '메스트', attribute: '수냉', rarity: 'SSR', manufacturer: '', class: '', weapon: '', burst: '2' },
    '355': { name: '앵커 : 이노센트 메이드', subName: '멩커', attribute: '수냉', rarity: 'SSR', manufacturer: '', class: '', weapon: '', burst: '2' },
    '381': { name: '비스킷', subName: '비스킷', attribute: '전격', rarity: 'SSR', manufacturer: '', class: '', weapon: '', burst: '2' },
    '382': { name: '레오나', subName: '레오나', attribute: '수냉', rarity: 'SSR', manufacturer: '', class: '', weapon: '', burst: '2' },
    '391': { name: '아인', subName: '아인', attribute: '전격', rarity: 'SSR', manufacturer: '', class: '', weapon: '', burst: '3' },
    '400': { name: '길티', subName: '길티', attribute: '풍압', rarity: 'SSR', manufacturer: '', class: '', weapon: '', burst: '2' },
    '403': { name: '퀀시', subName: '퀀시', attribute: '수냉', rarity: 'SSR', manufacturer: '', class: '', weapon: '', burst: '3' },
    '411': { name: '플로라', subName: '플로라', attribute: '전격', rarity: 'SSR', manufacturer: '', class: '', weapon: '', burst: '2' },
    '412': { name: '트리나', subName: '트리나', attribute: '전격', rarity: 'SSR', manufacturer: '', class: '', weapon: '', burst: '2' },
    '430': { name: '노이즈', subName: '노이즈', attribute: '전격', rarity: 'SSR', manufacturer: '', class: '', weapon: '', burst: '1' },
    '431': { name: '볼륨', subName: '볼륨', attribute: '풍압', rarity: 'SSR', manufacturer: '', class: '', weapon: '', burst: '1' },
    '432': { name: '아리아', subName: '아리아', attribute: '수냉', rarity: 'SSR', manufacturer: '', class: '', weapon: '', burst: '2' },
    '450': { name: '나가', subName: '나가', attribute: '전격', rarity: 'SSR', manufacturer: '', class: '', weapon: '', burst: '2' },
    '451': { name: '티아', subName: '티아', attribute: '철갑', rarity: 'SSR', manufacturer: '', class: '', weapon: '', burst: '1' },
    '470': { name: '레드 후드', subName: '레후', attribute: '철갑', rarity: 'SSR', manufacturer: '', class: '', weapon: '', burst: '3' },
    '500': { name: '일레그', subName: '일레그', attribute: '전격', rarity: 'SSR', manufacturer: '', class: '', weapon: '', burst: '2' },
    '502': { name: '일레스 : 붐 앤 쇼크', subName: '수레그', attribute: '수냉', rarity: 'SSR', manufacturer: '', class: '', weapon: '', burst: '3' },
    '511': { name: '신데렐라', subName: '신데렐라', attribute: '전격', rarity: 'SSR', manufacturer: '', class: '', weapon: '', burst: '3' },
    '513': { name: '리틀 머메이드', subName: '세이렌', attribute: '풍압', rarity: 'SSR', manufacturer: '', class: '', weapon: '', burst: '1' },
    '514': { name: '그레이브', subName: '그레이브', attribute: '작열', rarity: 'SSR', manufacturer: '', class: '', weapon: '', burst: '2' },
    '520': { name: '브래디', subName: '브래디', attribute: '수냉', rarity: 'SSR', manufacturer: '', class: '', weapon: '', burst: '3' },
    '521': { name: '크러스트', subName: '크러스트', attribute: '수냉', rarity: 'SSR', manufacturer: '', class: '', weapon: '', burst: '2' },
    '550': { name: '베이', subName: '베이', attribute: '작열', rarity: 'SSR', manufacturer: '', class: '', weapon: '', burst: '2' },
    '551': { name: '클레이', subName: '클레이', attribute: '전격', rarity: 'SSR', manufacturer: '', class: '', weapon: '', burst: '2' },
    '580': { name: '팬텀', subName: '팬텀', attribute: '수냉', rarity: 'SSR', manufacturer: '', class: '', weapon: '', burst: '3' },
    '581': { name: '아르카나', subName: '아르카나', attribute: '전격', rarity: 'SSR', manufacturer: '', class: '', weapon: '', burst: '2' },
    '810': { name: '2B', subName: '2B', attribute: '작열', rarity: 'SSR', manufacturer: '', class: '', weapon: '', burst: '3' },
    '811': { name: 'A2', subName: 'A2', attribute: '작열', rarity: 'SSR', manufacturer: '', class: '', weapon: '', burst: '3' },
    '820': { name: '렘', subName: '렘', attribute: '수냉', rarity: 'SSR', manufacturer: '', class: '', weapon: '', burst: '2' },
    '821': { name: '에밀리아', subName: '에밀리아', attribute: '수냉', rarity: 'SSR', manufacturer: '', class: '', weapon: '', burst: '3' },
    '830': { name: '아스카', subName: '작스카', attribute: '작열', rarity: 'SSR', manufacturer: '', class: '', weapon: '', burst: '3' },
    '831': { name: '레이', subName: '작레이', attribute: '작열', rarity: 'SSR', manufacturer: '', class: '', weapon: '', burst: '3' },
    '832': { name: '마리', subName: '마리', attribute: '전격', rarity: 'SSR', manufacturer: '', class: '', weapon: '', burst: '2' },
    '834': { name: '레이 (가칭)', subName: '풍레이', attribute: '풍압', rarity: 'SSR', manufacturer: '', class: '', weapon: '', burst: '3' },
    '835': { name: '아스카 : WILLE', subName: '풍스카', attribute: '풍압', rarity: 'SSR', manufacturer: '', class: '', weapon: '', burst: '3' },
    '850': { name: '이브', subName: '이브', attribute: '철갑', rarity: 'SSR', manufacturer: '', class: '', weapon: '', burst: '3' },
    '851': { name: '레이븐', subName: '레이븐', attribute: '철갑', rarity: 'SSR', manufacturer: '', class: '', weapon: '', burst: '3' }
};

// Store character attributes (extracted from CHARACTER_DATA)
let characterAttributes = {};

// Initialize character data from CHARACTER_DATA
function initializeCharacterAttributes() {
    const characters = document.querySelectorAll('.character');
    characters.forEach(character => {
        const characterId = character.dataset.character;
        
        // Extract attribute from CHARACTER_DATA
        if (CHARACTER_DATA[characterId] && CHARACTER_DATA[characterId].attribute) {
            characterAttributes[characterId] = CHARACTER_DATA[characterId].attribute;
        }
    });
}

// Add attribute and burst icons to character and apply border color if placed
function addAttributeIcon(character) {
    const characterId = character.dataset.character;
    const characterData = CHARACTER_DATA[characterId];
    
    if (!characterData) return;
    
    const attributeType = characterData.attribute;
    const burstType = characterData.burst;
    
    // Handle attribute icon
    if (attributeType && ATTRIBUTE_ICONS[attributeType]) {
        // Remove existing attribute icon if any
        const existingIcon = character.querySelector('.attribute-icon');
        if (existingIcon) {
            existingIcon.remove();
        }
        
        // Create and add new attribute icon
        const iconElement = document.createElement('div');
        iconElement.className = 'attribute-icon';
        iconElement.style.backgroundImage = `url('${ATTRIBUTE_ICONS[attributeType]}')`;
        iconElement.title = attributeType;
        character.appendChild(iconElement);
        
        // Apply attribute border color to deck slot if character is placed
        if (character.classList.contains('placed')) {
            const slot = character.parentElement;
            if (slot && slot.classList.contains('deck-slot')) {
                // Remove existing attribute classes
                slot.classList.remove('attribute-전격', 'attribute-작열', 'attribute-철갑', 'attribute-수냉', 'attribute-풍압');
                // Add current attribute class
                slot.classList.add(`attribute-${attributeType}`);
            }
        }
    }
    
    // Handle burst icon
    if (burstType === '1' || burstType === '2' || burstType === '3') {
        // Remove existing burst icon if any
        const existingBurstIcon = character.querySelector('.burst-icon');
        if (existingBurstIcon) {
            existingBurstIcon.remove();
        }
        
        // Create and add new burst icon with hexagon background
        const burstElement = document.createElement('div');
        burstElement.className = 'burst-icon';
        burstElement.title = `Burst ${burstType}`;
        
        // Create inner black hexagon
        const innerHex = document.createElement('div');
        innerHex.className = 'inner-hex';
        burstElement.appendChild(innerHex);
        
        // Create a style element for the ::after pseudo-element
        const burstImageUrl = `url('images/icon-burst-${burstType}.webp')`;
        
        // Set a data attribute to identify this specific burst icon
        const burstId = `burst-${characterId}-${Date.now()}`;
        burstElement.setAttribute('data-burst-id', burstId);
        
        // Create dynamic CSS for this specific burst icon
        const style = document.createElement('style');
        style.textContent = `
            .burst-icon[data-burst-id="${burstId}"]::after {
                background-image: ${burstImageUrl} !important;
            }
        `;
        document.head.appendChild(style);
        
        character.appendChild(burstElement);
    } else {
        // Remove burst icon if burst type is not 1, 2, or 3
        const existingBurstIcon = character.querySelector('.burst-icon');
        if (existingBurstIcon) {
            // Remove associated style element
            const burstId = existingBurstIcon.getAttribute('data-burst-id');
            if (burstId) {
                const styles = document.querySelectorAll('style');
                styles.forEach(style => {
                    if (style.textContent.includes(burstId)) {
                        style.remove();
                    }
                });
            }
            existingBurstIcon.remove();
        }
    }
}

// Apply attribute border color to slot
function applyAttributeBorderColor(slot, character) {
    const characterId = character.dataset.character;
    const attributeType = characterAttributes[characterId];
    
    if (attributeType) {
        // Remove existing attribute classes
        slot.classList.remove('attribute-전격', 'attribute-작열', 'attribute-철갑', 'attribute-수냉', 'attribute-풍압');
        // Add current attribute class
        slot.classList.add(`attribute-${attributeType}`);
    }
}

// Helper function to insert character at original position
function insertAtOriginalPosition(parent, child, nextSibling) {
    // If nextSibling is still in DOM and is a child of parent, use it
    if (nextSibling && nextSibling.parentElement === parent) {
        parent.insertBefore(child, nextSibling);
    } else {
        // Otherwise append to parent
        parent.appendChild(child);
    }
}

// Helper function to get the index of an element in its parent
function getElementIndex(element) {
    return Array.from(element.parentElement.children).indexOf(element);
}

// Helper function to insert at specific index
function insertAtIndex(parent, child, index) {
    const children = parent.children;
    if (index >= children.length) {
        parent.appendChild(child);
    } else {
        parent.insertBefore(child, children[index]);
    }
}

// Update all character attribute icons
function updateAllAttributeIcons() {
    const characters = document.querySelectorAll('.character');
    characters.forEach(character => {
        addAttributeIcon(character);
    });
}

// Page load event - load configuration from URL
window.addEventListener('load', function() {
    initializeCharacterAttributes();
    updateAllAttributeIcons();
    loadConfigurationFromUrl();
});

// Get character data functions
function getCharacterData(characterId) {
    return CHARACTER_DATA[characterId] || null;
}

function getCharacterName(characterId) {
    return CHARACTER_DATA[characterId] ? CHARACTER_DATA[characterId].name : null;
}

function getCharacterAttribute(characterId) {
    return CHARACTER_DATA[characterId] ? CHARACTER_DATA[characterId].attribute : null;
}

// Set character attribute function (updates CHARACTER_DATA)
function setCharacterAttribute(characterId, attributeType) {
    if (ATTRIBUTE_ICONS[attributeType]) {
        if (!CHARACTER_DATA[characterId]) {
            CHARACTER_DATA[characterId] = {};
        }
        CHARACTER_DATA[characterId].attribute = attributeType;
        characterAttributes[characterId] = attributeType;
        const character = document.querySelector(`[data-character="${characterId}"]`);
        if (character) {
            addAttributeIcon(character);
        }
    }
}


function getAllCharacterAttributes() {
    return { ...characterAttributes };
}

function setAllCharacterAttributes(attributes) {
    characterAttributes = { ...attributes };
    updateAllAttributeIcons();
}

// Base64 encoding/decoding functions (UTF-8 safe)
function encodeConfiguration() {
    const config = {
        decks: [],
        candidates: [],
        pool: [],
        attributes: characterAttributes
    };
    
    // Collect character info from each deck
    for (let i = 1; i <= 5; i++) {
        const deckSlots = document.querySelectorAll(`[data-deck="${i}"] .deck-slot`);
        const deck = [];
        deckSlots.forEach(slot => {
            if (slot.children.length > 0) {
                const character = slot.children[0];
                deck.push(character.dataset.character);
            } else {
                deck.push(null);
            }
        });
        config.decks.push(deck);
    }
    
    // Collect candidate pool order
    const candidateCharacters = document.querySelectorAll('#candidateGrid .character');
    candidateCharacters.forEach(char => {
        config.candidates.push(char.dataset.character);
    });
    
    // Collect character pool order
    const poolCharacters = document.querySelectorAll('.character-pool .character-grid .character');
    poolCharacters.forEach(char => {
        config.pool.push(char.dataset.character);
    });
    
    // UTF-8 safe base64 encoding
    const jsonString = JSON.stringify(config);
    const utf8Bytes = new TextEncoder().encode(jsonString);
    const binaryString = Array.from(utf8Bytes, byte => String.fromCharCode(byte)).join('');
    return btoa(binaryString);
}

function decodeConfiguration(encodedConfig) {
    try {
        // UTF-8 safe base64 decoding
        const binaryString = atob(encodedConfig);
        const utf8Bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            utf8Bytes[i] = binaryString.charCodeAt(i);
        }
        const jsonString = new TextDecoder().decode(utf8Bytes);
        const config = JSON.parse(jsonString);
        
        // Ensure candidates array exists for backward compatibility
        if (!config.candidates) {
            config.candidates = [];
        }
        // Ensure attributes object exists for backward compatibility
        if (!config.attributes) {
            config.attributes = {};
        }
        return config;
    } catch (e) {
        console.error('Invalid configuration:', e);
        return null;
    }
}

// Apply configuration
function applyConfiguration(config) {
    if (!config || !config.decks || !config.pool) return false;
    
    // Clear all decks
    clearAllDecks();
    
    // Apply character attributes if available
    if (config.attributes) {
        characterAttributes = { ...config.attributes };
        updateAllAttributeIcons();
    }
    
    // Apply deck configuration
    config.decks.forEach((deck, deckIndex) => {
        deck.forEach((charId, slotIndex) => {
            if (charId) {
                const character = document.querySelector(`[data-character="${charId}"]`);
                const slot = document.querySelector(`[data-deck="${deckIndex + 1}"] [data-slot="${slotIndex}"]`);
                if (character && slot) {
                    slot.appendChild(character);
                    slot.classList.add('occupied');
                    slot.classList.remove('empty-slot');
                    character.classList.add('placed');
                    addAttributeIcon(character);  // Add attribute icon when placing
                    applyAttributeBorderColor(slot, character);  // Apply attribute border color
                }
            }
        });
    });
    
    // Apply candidate pool order
    if (config.candidates && config.candidates.length > 0) {
        const candidatePool = document.querySelector('#candidateGrid');
        config.candidates.forEach(charId => {
            const character = document.querySelector(`[data-character="${charId}"]`);
            if (character && !character.classList.contains('placed')) {
                candidatePool.appendChild(character);
            }
        });
    }
    
    // Apply character pool order
    const pool = document.querySelector('.character-pool .character-grid');
    config.pool.forEach(charId => {
        const character = document.querySelector(`[data-character="${charId}"]`);
        if (character && !character.classList.contains('placed') && character.parentElement !== document.querySelector('#candidateGrid')) {
            pool.appendChild(character);
        }
    });
    
    return true;
}

// Load configuration from URL
function loadConfigurationFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const configParam = urlParams.get('config');
    
    if (configParam) {
        const config = decodeConfiguration(configParam);
        if (config) {
            applyConfiguration(config);
            showNotification('덱 구성이 URL에서 로드되었습니다!');
        } else {
            showNotification('잘못된 URL 형식입니다.', 'error');
        }
    }
}

// Share configuration function
async function shareConfiguration() {
    const encodedConfig = encodeConfiguration();
    let baseUrl;
    
    // Handle both local file and web server scenarios
    if (window.location.protocol === 'file:') {
        baseUrl = window.location.href.split('?')[0];
    } else {
        baseUrl = window.location.origin + window.location.pathname;
    }
    
    const shareUrl = `${baseUrl}?config=${encodedConfig}`;
    
    // Automatically copy to clipboard
    try {
        await navigator.clipboard.writeText(shareUrl);
        showNotification('덱 공유 URL이 클립보드에 복사되었습니다!');
    } catch (err) {
        // Fallback for browsers without clipboard API support
        const textArea = document.createElement('textarea');
        textArea.value = shareUrl;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showNotification('덱 공유 URL이 복사되었습니다!');
    }
}


// Clear all decks function
function clearAllDecks() {
    // Return all placed characters to main pool
    const placedCharacters = document.querySelectorAll('.character.placed');
    const pool = document.querySelector('.character-pool .character-grid');
    
    placedCharacters.forEach(char => {
        pool.appendChild(char);
        char.classList.remove('placed');
    });
    
    // Reset all deck slots
    const allSlots = document.querySelectorAll('.deck-slot');
    allSlots.forEach(slot => {
        slot.classList.remove('occupied');
        slot.classList.add('empty-slot');
        // Remove attribute border colors
        slot.classList.remove('attribute-전격', 'attribute-작열', 'attribute-철갑', 'attribute-수냉', 'attribute-풍압');
    });
    
    // Clear candidate pool
    const candidatePool = document.querySelector('#candidateGrid');
    const candidateCharacters = candidatePool.querySelectorAll('.character');
    candidateCharacters.forEach(char => {
        pool.appendChild(char);
    });
    
    showNotification('모든 덱이 초기화되었습니다.');
}

// Show notification function
function showNotification(message, type = 'success') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    if (type === 'error') {
        notification.style.background = '#e53e3e';
    }
    
    document.body.appendChild(notification);
    
    // Show animation
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Create drop indicator function
function createDropIndicator(targetGrid) {
    if (!dropIndicator) {
        dropIndicator = document.createElement('div');
        dropIndicator.className = 'drop-indicator';
    }
    // Move indicator to target grid if needed
    if (dropIndicator.parentElement !== targetGrid) {
        targetGrid.appendChild(dropIndicator);
    }
    return dropIndicator;
}

// Calculate drop position in character pool
function getDropPosition(e, targetGrid) {
    const characters = [...targetGrid.children].filter(child => child.classList.contains('character'));
    const rect = targetGrid.getBoundingClientRect();
    
    // Get grid layout info
    const gridStyle = window.getComputedStyle(targetGrid);
    const gap = parseInt(gridStyle.gap) || 12;
    const padding = parseInt(gridStyle.paddingLeft) || 12;
    
    let insertIndex = characters.length;
    let indicatorLeft = padding;
    let indicatorTop = padding;
    
    // If no characters, place at beginning
    if (characters.length === 0) {
        return { index: 0, left: indicatorLeft, top: indicatorTop };
    }
    
    // Find the closest position based on mouse coordinates
    let minDistance = Infinity;
    let bestIndex = characters.length;
    let bestLeft = indicatorLeft;
    let bestTop = indicatorTop;
    
    for (let i = 0; i <= characters.length; i++) {
        let posLeft, posTop;
        
        if (i < characters.length) {
            const charRect = characters[i].getBoundingClientRect();
            posLeft = charRect.left - rect.left;
            posTop = charRect.top - rect.top;
        } else {
            // Position after last character
            if (characters.length > 0) {
                const lastCharRect = characters[characters.length - 1].getBoundingClientRect();
                posLeft = lastCharRect.right - rect.left + gap;
                posTop = lastCharRect.top - rect.top;
                
                // Check if we need to wrap to next row
                if (posLeft + 85 > targetGrid.clientWidth - padding) {
                    posLeft = padding;
                    posTop = lastCharRect.bottom - rect.top + gap;
                }
            }
        }
        
        const distance = Math.sqrt(
            Math.pow(e.clientX - (rect.left + posLeft + 42.5), 2) + 
            Math.pow(e.clientY - (rect.top + posTop + 42.5), 2)
        );
        
        if (distance < minDistance) {
            minDistance = distance;
            bestIndex = i;
            bestLeft = posLeft;
            bestTop = posTop;
        }
    }
    
    return { index: bestIndex, left: bestLeft, top: bestTop };
}

// Drag start event
document.addEventListener('dragstart', function(e) {
    if (e.target.classList.contains('character')) {
        isDragging = true;  // Mark as dragging to prevent click handling
        draggedElement = e.target;
        e.target.classList.add('dragging');
        
        // Remember original position for precise swapping
        draggedOriginalParent = e.target.parentElement;
        // Create invisible placeholder to mark original position
        draggedPlaceholder = document.createElement('div');
        draggedPlaceholder.style.display = 'none';
        draggedPlaceholder.classList.add('drag-placeholder');
        e.target.parentElement.insertBefore(draggedPlaceholder, e.target.nextSibling);
        
        // Check if dragging from deck slot
        const parentSlot = e.target.parentElement;
        if (parentSlot.classList.contains('deck-slot')) {
            draggedFromDeck = parentSlot.parentElement.dataset.deck;
            draggedFromSlot = parentSlot.dataset.slot;
            draggedFromPool = false;
        } else if (parentSlot.classList.contains('character-grid')) {
            // Dragging from character pool
            draggedFromPool = true;
            draggedFromDeck = null;
            draggedFromSlot = null;
        }
    }
});

// Drag end event
document.addEventListener('dragend', function(e) {
    if (e.target.classList.contains('character')) {
        e.target.classList.remove('dragging');
        if (dropIndicator) {
            dropIndicator.classList.remove('show');
        }
        draggedElement = null;
        draggedFromDeck = null;
        draggedFromSlot = null;
        draggedFromPool = false;
        draggedOriginalParent = null;
        // Remove placeholder if exists
        if (draggedPlaceholder && draggedPlaceholder.parentElement) {
            draggedPlaceholder.parentElement.removeChild(draggedPlaceholder);
        }
        draggedPlaceholder = null;
    }
});

// Drag over event
document.addEventListener('dragover', function(e) {
    if (e.target.classList.contains('deck-slot')) {
        e.preventDefault();
        e.target.classList.add('drag-over');
    }
    // Character pool drag over (both candidate and main pool)
    else if (e.target.classList.contains('character-grid') || 
             (e.target.classList.contains('character') && e.target.parentElement.classList.contains('character-grid'))) {
        e.preventDefault();
        
        if (draggedFromPool && draggedElement) {
            const targetGrid = e.target.classList.contains('character-grid') ? e.target : e.target.parentElement;
            const indicator = createDropIndicator(targetGrid);
            const position = getDropPosition(e, targetGrid);
            indicator.style.left = position.left + 'px';
            indicator.style.top = position.top + 'px';
            indicator.classList.add('show');
        }
    }
});

// Drag leave event
document.addEventListener('dragleave', function(e) {
    if (e.target.classList.contains('deck-slot')) {
        e.target.classList.remove('drag-over');
    }
});

// Drop event
document.addEventListener('drop', function(e) {
    // Drop on deck slot
    if (e.target.classList.contains('deck-slot')) {
        e.preventDefault();
        e.target.classList.remove('drag-over');
        
        if (draggedElement) {
            // Check if slot already has character
            if (e.target.children.length > 0) {
                // Swap characters
                const existingCharacter = e.target.children[0];
                
                if (draggedFromDeck && draggedFromSlot !== null) {
                    // Swap between deck slots
                    const originalSlot = document.querySelector(`[data-deck="${draggedFromDeck}"] [data-slot="${draggedFromSlot}"]`);
                    
                    // Remove existing character from target slot and clear its styling
                    existingCharacter.classList.remove('placed');
                    e.target.classList.remove('occupied', 'attribute-전격', 'attribute-작열', 'attribute-철갑', 'attribute-수냉', 'attribute-풍압');
                    e.target.classList.add('empty-slot');
                    
                    // Place existing character in original slot
                    originalSlot.appendChild(existingCharacter);
                    originalSlot.classList.add('occupied');
                    originalSlot.classList.remove('empty-slot');
                    existingCharacter.classList.add('placed');
                    addAttributeIcon(existingCharacter);
                    applyAttributeBorderColor(originalSlot, existingCharacter);
                } else {
                    // Dragging from candidate or main pool to occupied deck slot
                    // Remove existing character and send it to dragged element's original position
                    existingCharacter.classList.remove('placed');
                    e.target.classList.remove('occupied', 'attribute-전격', 'attribute-작열', 'attribute-철갑', 'attribute-수냉', 'attribute-풍압');
                    e.target.classList.add('empty-slot');
                    
                    // Place existing character at the exact original position of dragged element
                    if (draggedPlaceholder && draggedPlaceholder.parentElement) {
                        draggedPlaceholder.parentElement.insertBefore(existingCharacter, draggedPlaceholder);
                        draggedPlaceholder.parentElement.removeChild(draggedPlaceholder);
                        draggedPlaceholder = null;
                    } else {
                        draggedOriginalParent.appendChild(existingCharacter);
                    }
                }
            } else if (draggedFromDeck && draggedFromSlot !== null) {
                // Moving from deck to empty deck slot - clear original slot
                const originalSlot = document.querySelector(`[data-deck="${draggedFromDeck}"] [data-slot="${draggedFromSlot}"]`);
                originalSlot.classList.remove('occupied', 'attribute-전격', 'attribute-작열', 'attribute-철갑', 'attribute-수냉', 'attribute-풍압');
                originalSlot.classList.add('empty-slot');
            }
            
            // Place dragged character in target slot
            e.target.appendChild(draggedElement);
            e.target.classList.add('occupied');
            e.target.classList.remove('empty-slot');
            draggedElement.classList.add('placed');
            addAttributeIcon(draggedElement);  // Add attribute icon when placing
            applyAttributeBorderColor(e.target, draggedElement);  // Apply attribute border color
        }
    }
    // Drop on character pool (both candidate and main pool)
    else if ((e.target.classList.contains('character-grid') || 
             (e.target.classList.contains('character') && e.target.parentElement.classList.contains('character-grid'))) 
             && draggedElement) {
        e.preventDefault();
        
        const targetGrid = e.target.classList.contains('character-grid') ? e.target : e.target.parentElement;
        const characters = [...targetGrid.children].filter(child => child.classList.contains('character') && child !== draggedElement);
        const position = getDropPosition(e, targetGrid);
        
        // If dragging from deck, clear original slot
        if (draggedFromDeck && draggedFromSlot !== null) {
            const originalSlot = document.querySelector(`[data-deck="${draggedFromDeck}"] [data-slot="${draggedFromSlot}"]`);
            originalSlot.classList.remove('occupied');
            originalSlot.classList.add('empty-slot');
            draggedElement.classList.remove('placed');
        }
        
        // Remove dragged character from current position
        draggedElement.remove();
        
        // Insert at new position
        if (position.index >= characters.length) {
            targetGrid.appendChild(draggedElement);
        } else {
            targetGrid.insertBefore(draggedElement, characters[position.index]);
        }
        
        if (dropIndicator) {
            dropIndicator.classList.remove('show');
        }
    }
});

// Mouse down event to track click start
document.addEventListener('mousedown', function(e) {
    if (e.target.classList.contains('character')) {
        mouseDownTime = Date.now();
        mouseDownPos = { x: e.clientX, y: e.clientY };
        isDragging = false;
    }
});

// Mouse up event to handle clicks vs drags
document.addEventListener('mouseup', function(e) {
    if (e.target.classList.contains('character') && mouseDownTime > 0) {
        const timeDiff = Date.now() - mouseDownTime;
        const pos = { x: e.clientX, y: e.clientY };
        const distance = mouseDownPos ? 
            Math.sqrt(Math.pow(pos.x - mouseDownPos.x, 2) + Math.pow(pos.y - mouseDownPos.y, 2)) : 0;
        
        // Consider it a click if: time < 200ms AND distance < 5px AND not dragging
        if (timeDiff < 200 && distance < 5 && !isDragging) {
            handleCharacterClick(e);
        }
        
        mouseDownTime = 0;
        mouseDownPos = null;
        isDragging = false;
    }
});

// Character click handling function
function handleCharacterClick(e) {
    // Handle click on placed character (unplace)
    if (e.target.classList.contains('character') && e.target.classList.contains('placed')) {
        e.preventDefault();
        e.stopPropagation();
        const slot = e.target.parentElement;
        document.querySelector('#candidateGrid').appendChild(e.target);
        e.target.classList.remove('placed');
        slot.classList.remove('occupied');
        slot.classList.add('empty-slot');
        // Remove attribute border color
        slot.classList.remove('attribute-전격', 'attribute-작열', 'attribute-철갑', 'attribute-수냉', 'attribute-풍압');
        return;
    }
    // Handle click on nikke area character (move to candidate)
    else if (e.target.classList.contains('character') && 
             e.target.parentElement.classList.contains('character-grid') &&
             e.target.parentElement.parentElement.classList.contains('character-pool')) {
        e.preventDefault();
        e.stopPropagation();
        document.querySelector('#candidateGrid').appendChild(e.target);
    }
    // Handle click on candidate area character (auto-place to deck)
    else if (e.target.classList.contains('character') && 
             e.target.parentElement.id === 'candidateGrid') {
        e.preventDefault();
        e.stopPropagation();
        
        // Find first available deck slot
        let targetSlot = null;
        for (let deckNum = 1; deckNum <= 5; deckNum++) {
            for (let slotNum = 0; slotNum < 5; slotNum++) {
                const slot = document.querySelector(`[data-deck="${deckNum}"] [data-slot="${slotNum}"]`);
                if (slot && slot.children.length === 0) {
                    targetSlot = slot;
                    break;
                }
            }
            if (targetSlot) break;
        }
        
        // Place character in first available slot
        if (targetSlot) {
            targetSlot.appendChild(e.target);
            targetSlot.classList.add('occupied');
            targetSlot.classList.remove('empty-slot');
            e.target.classList.add('placed');
            addAttributeIcon(e.target);  // Add attribute icon when placing
            applyAttributeBorderColor(targetSlot, e.target);  // Apply attribute border color
        }
    }
}


// Create drag ghost function
function createDragGhost(element) {
    const ghost = element.cloneNode(true);
    ghost.classList.add('drag-ghost');
    ghost.classList.remove('placed', 'dragging');
    ghost.style.width = element.offsetWidth + 'px';
    ghost.style.height = element.offsetHeight + 'px';
    document.body.appendChild(ghost);
    return ghost;
}

// Update drag ghost position
function updateDragGhostPosition(x, y) {
    if (dragGhost) {
        dragGhost.style.left = (x - dragGhost.offsetWidth / 2) + 'px';
        dragGhost.style.top = (y - dragGhost.offsetHeight / 2) + 'px';
    }
}

// Remove drag ghost
function removeDragGhost() {
    if (dragGhost) {
        dragGhost.remove();
        dragGhost = null;
    }
}

// Touch events for mobile drag and drop  
document.addEventListener('touchstart', function(e) {
    if (e.target.classList.contains('character')) {
        e.preventDefault();
        touchStartPos = {
            x: e.touches[0].clientX,
            y: e.touches[0].clientY,
            time: Date.now()
        };
        touchTarget = e.target;
        isTouchDragging = false;
        
        // Set up dragging state
        draggedElement = e.target;
        
        // Remember original position for precise swapping
        draggedOriginalParent = e.target.parentElement;
        // Create invisible placeholder to mark original position
        draggedPlaceholder = document.createElement('div');
        draggedPlaceholder.style.display = 'none';
        draggedPlaceholder.classList.add('drag-placeholder');
        e.target.parentElement.insertBefore(draggedPlaceholder, e.target.nextSibling);
        
        const parentSlot = e.target.parentElement;
        if (parentSlot.classList.contains('deck-slot')) {
            draggedFromDeck = parentSlot.parentElement.dataset.deck;
            draggedFromSlot = parentSlot.dataset.slot;
            draggedFromPool = false;
        } else if (parentSlot.classList.contains('character-grid')) {
            draggedFromPool = true;
            draggedFromDeck = null;
            draggedFromSlot = null;
        }
    }
}, { passive: false });

document.addEventListener('touchmove', function(e) {
    if (touchTarget && touchStartPos) {
        const touch = e.touches[0];
        const deltaX = Math.abs(touch.clientX - touchStartPos.x);
        const deltaY = Math.abs(touch.clientY - touchStartPos.y);
        
        // Start dragging if moved enough
        if (!isTouchDragging && (deltaX > 10 || deltaY > 10)) {
            isTouchDragging = true;
            touchTarget.classList.add('dragging');
            
            // Create and show drag ghost
            dragGhost = createDragGhost(touchTarget);
            updateDragGhostPosition(touch.clientX, touch.clientY);
            
            e.preventDefault();
        }
        
        if (isTouchDragging) {
            e.preventDefault();
            
            // Update drag ghost position
            updateDragGhostPosition(touch.clientX, touch.clientY);
            
            // Find element under touch point
            const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
            
            // Clear previous drop targets
            document.querySelectorAll('.deck-slot').forEach(slot => {
                slot.classList.remove('drag-over');
            });
            
            // Highlight drop target
            if (elementBelow && elementBelow.classList.contains('deck-slot')) {
                elementBelow.classList.add('drag-over');
                touchDropTarget = elementBelow;
            } else if (elementBelow && elementBelow.parentElement && elementBelow.parentElement.classList.contains('deck-slot')) {
                elementBelow.parentElement.classList.add('drag-over');
                touchDropTarget = elementBelow.parentElement;
            } else if (elementBelow && (elementBelow.classList.contains('character-grid') || 
                      (elementBelow.classList.contains('character') && elementBelow.parentElement.classList.contains('character-grid')))) {
                // Handle drop on character pools (candidate and main)
                const grid = elementBelow.classList.contains('character-grid') ? elementBelow : elementBelow.parentElement;
                touchDropTarget = grid;
            } else {
                touchDropTarget = null;
            }
        }
    }
}, { passive: false });

document.addEventListener('touchend', function(e) {
    if (touchTarget && touchStartPos) {
        const touch = e.changedTouches[0];
        const timeDiff = Date.now() - touchStartPos.time;
        const distance = Math.sqrt(
            Math.pow(touch.clientX - touchStartPos.x, 2) + 
            Math.pow(touch.clientY - touchStartPos.y, 2)
        );
        
        // Handle as click if: short time, small distance, and not dragging
        if (timeDiff < 200 && distance < 10 && !isTouchDragging) {
            e.preventDefault();
            handleCharacterClick({ target: touchTarget, preventDefault: () => {}, stopPropagation: () => {} });
        }
        // Handle as drag drop
        else if (isTouchDragging && touchDropTarget) {
            e.preventDefault();
            
            // Perform drop operation
            if (touchDropTarget.classList.contains('deck-slot')) {
            // Check if slot already has character
            if (touchDropTarget.children.length > 0) {
                // Swap characters
                const existingCharacter = touchDropTarget.children[0];
                
                if (draggedFromDeck && draggedFromSlot !== null) {
                    // Swap between deck slots
                    const originalSlot = document.querySelector(`[data-deck="${draggedFromDeck}"] [data-slot="${draggedFromSlot}"]`);
                    
                    // Remove existing character from target slot and clear its styling
                    existingCharacter.classList.remove('placed');
                    touchDropTarget.classList.remove('occupied', 'attribute-전격', 'attribute-작열', 'attribute-철갑', 'attribute-수냉', 'attribute-풍압');
                    touchDropTarget.classList.add('empty-slot');
                    
                    // Place existing character in original slot
                    originalSlot.appendChild(existingCharacter);
                    originalSlot.classList.add('occupied');
                    originalSlot.classList.remove('empty-slot');
                    existingCharacter.classList.add('placed');
                    addAttributeIcon(existingCharacter);
                    applyAttributeBorderColor(originalSlot, existingCharacter);
                } else {
                    // Dragging from candidate or main pool to occupied deck slot
                    // Remove existing character and send it to dragged element's original position
                    existingCharacter.classList.remove('placed');
                    touchDropTarget.classList.remove('occupied', 'attribute-전격', 'attribute-작열', 'attribute-철갑', 'attribute-수냉', 'attribute-풍압');
                    touchDropTarget.classList.add('empty-slot');
                    
                    // Place existing character at the exact original position of dragged element
                    if (draggedPlaceholder && draggedPlaceholder.parentElement) {
                        draggedPlaceholder.parentElement.insertBefore(existingCharacter, draggedPlaceholder);
                        draggedPlaceholder.parentElement.removeChild(draggedPlaceholder);
                        draggedPlaceholder = null;
                    } else {
                        draggedOriginalParent.appendChild(existingCharacter);
                    }
                }
            } else if (draggedFromDeck && draggedFromSlot !== null) {
                // Moving from deck to empty deck slot - clear original slot
                const originalSlot = document.querySelector(`[data-deck="${draggedFromDeck}"] [data-slot="${draggedFromSlot}"]`);
                originalSlot.classList.remove('occupied', 'attribute-전격', 'attribute-작열', 'attribute-철갑', 'attribute-수냉', 'attribute-풍압');
                originalSlot.classList.add('empty-slot');
            }
            
            // Place dragged character in target slot
            touchDropTarget.appendChild(touchTarget);
            touchDropTarget.classList.add('occupied');
            touchDropTarget.classList.remove('empty-slot');
            touchTarget.classList.add('placed');
            addAttributeIcon(touchTarget);  // Add attribute icon when placing
            applyAttributeBorderColor(touchDropTarget, touchTarget);  // Apply attribute border color
        } else if (touchDropTarget.classList.contains('character-grid')) {
            // Handle drop on character pools (both candidate and main)
            const touch = e.changedTouches[0];
            const grid = touchDropTarget;
            const characters = [...grid.children].filter(child => child.classList.contains('character') && child !== touchTarget);
            
            // If dragging from deck, clear original slot
            if (draggedFromDeck && draggedFromSlot !== null) {
                const originalSlot = document.querySelector(`[data-deck="${draggedFromDeck}"] [data-slot="${draggedFromSlot}"]`);
                originalSlot.classList.remove('occupied');
                originalSlot.classList.add('empty-slot');
                touchTarget.classList.remove('placed');
            }
            
            // Find insertion point using same logic as desktop
            const position = getDropPosition({
                clientX: touch.clientX,
                clientY: touch.clientY
            }, grid);
            const insertIndex = position.index;
            
            // Remove dragged character
            touchTarget.remove();
            
            // Insert at new position
            if (insertIndex >= characters.length) {
                grid.appendChild(touchTarget);
            } else {
                grid.insertBefore(touchTarget, characters[insertIndex]);
            }
        }
    }
    
    // Clean up - always execute regardless of if conditions above
    if (touchTarget) {
        touchTarget.classList.remove('dragging');
    }
    document.querySelectorAll('.deck-slot').forEach(slot => {
        slot.classList.remove('drag-over');
    });
    
    // Remove drag ghost
    removeDragGhost();
    
    touchStartPos = null;
    touchTarget = null;
    isTouchDragging = false;
    touchDropTarget = null;
    draggedElement = null;
    draggedFromDeck = null;
    draggedFromSlot = null;
    draggedFromPool = false;
    draggedOriginalParent = null;
    // Remove placeholder if exists
    if (draggedPlaceholder && draggedPlaceholder.parentElement) {
        draggedPlaceholder.parentElement.removeChild(draggedPlaceholder);
    }
    draggedPlaceholder = null;
    }
}, { passive: false });

// Burst filter functions
function toggleBurstFilter(burstNumber) {
    const filterBtn = document.querySelector(`.burst-filter-btn[data-burst="${burstNumber}"]`);
    
    if (activeBurstFilters.has(burstNumber.toString())) {
        // Remove from active filters
        activeBurstFilters.delete(burstNumber.toString());
        filterBtn.classList.remove('active');
    } else {
        // Add to active filters
        activeBurstFilters.add(burstNumber.toString());
        filterBtn.classList.add('active');
    }
    
    // Apply filter
    applyBurstFilter();
}

function applySearch() {
    const searchInput = document.getElementById('characterSearch');
    currentSearchTerm = searchInput.value.trim();
    applyAllFilters();
}

function applyBurstFilter() {
    applyAllFilters();
}

function applyAllFilters() {
    const allCharacters = document.querySelectorAll('.character-pool .character-grid .character');
    
    allCharacters.forEach(character => {
        const characterId = character.dataset.character;
        const characterData = CHARACTER_DATA[characterId];
        
        if (!characterData) {
            character.style.display = 'flex'; // Show characters without data
            return;
        }
        
        // Check burst filter
        let burstMatch = true;
        if (activeBurstFilters.size > 0) {
            const burstType = characterData.burst;
            burstMatch = activeBurstFilters.has(burstType);
        }
        
        // Check text search
        let searchMatch = true;
        if (currentSearchTerm) {
            const searchLower = currentSearchTerm.toLowerCase().replace(/\s+/g, '');
            const nameNoSpaces = characterData.name.toLowerCase().replace(/\s+/g, '');
            const subNameNoSpaces = characterData.subName.toLowerCase().replace(/\s+/g, '');
            const nameMatch = nameNoSpaces.includes(searchLower);
            const subNameMatch = subNameNoSpaces.includes(searchLower);
            searchMatch = nameMatch || subNameMatch;
        }
        
        // Show character only if it passes both filters
        if (burstMatch && searchMatch) {
            character.style.display = 'flex';
        } else {
            character.style.display = 'none';
        }
    });
}

// Initialize filters and routing on page load
window.addEventListener('load', function() {
    // Apply initial filter state (show all)
    applyAllFilters();
    
    // Initialize URL routing
    initializeRouting();
});

// URL routing system
const routes = {
    '/': 'deck-maker',
    '/deckmaker': 'deck-maker',
    '/module': 'module-simulation',
    '/character-info': 'character-info',
    '/team-analysis': 'team-analysis',
    '/guide': 'guide'
};

// Get page ID from URL path
function getPageFromPath(path) {
    // Remove any query parameters or hash
    const cleanPath = path.split('?')[0].split('#')[0];
    return routes[cleanPath] || 'deck-maker'; // Default to deck-maker
}

// Show page based on page ID
function showPage(pageId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Show selected page
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
    }
    
    // Update navbar active state based on current page
    updateNavbarActiveState(pageId);
}

// Update navbar active state
function updateNavbarActiveState(pageId) {
    document.querySelectorAll('.navbar a').forEach(link => {
        link.classList.remove('active');
    });

    // Find the correct nav link for the current page
    const currentPath = getCurrentPathForPage(pageId);
    const activeLink = document.querySelector(`.navbar a[href="${currentPath}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
}

// Get URL path for page ID
function getCurrentPathForPage(pageId) {
    for (const [path, id] of Object.entries(routes)) {
        if (id === pageId) {
            return path === '/' ? '/deckmaker' : path; // Use /deckmaker for consistency
        }
    }
    return '/deckmaker';
}

// Navigate to a specific route
function navigateToRoute(path) {
    // Update browser URL without page reload
    history.pushState({}, '', path);
    
    // Show the corresponding page
    const pageId = getPageFromPath(path);
    showPage(pageId);
}

// Handle navigation link clicks
function handleNavClick(event) {
    event.preventDefault();
    const path = event.target.getAttribute('href');
    navigateToRoute(path);
}

// Handle browser back/forward buttons
window.addEventListener('popstate', function(event) {
    const pageId = getPageFromPath(window.location.pathname);
    showPage(pageId);
});

// Route initialization on page load
function initializeRouting() {
    // Get current path and show appropriate page
    const currentPath = window.location.pathname;
    const pageId = getPageFromPath(currentPath);
    
    // If we're on root path, redirect to /deckmaker
    if (currentPath === '/' || currentPath === '/index.html') {
        history.replaceState({}, '', '/deckmaker');
    }
    
    showPage(pageId);
    
    // Add click handlers to navigation links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', handleNavClick);
    });
}