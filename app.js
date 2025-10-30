// app.js

let selectedFoods = [];
let targetUser = ''; // 対象者を保持する変数

// ---------------------------------------------
// 🍎 栄養データと目標値（簡易版）
// ---------------------------------------------

// 食材/料理データと栄養価 (Pythonデータの一部を模倣し、JavaScriptで利用)
// P: タンパク質, L: 脂質, C: 炭水化物, V: 野菜量(仮想)
const FOOD_NUTRITION_DATA = {
    "ごはん": { type: "主食", P: 5, L: 1, C: 80, V: 0, kcal: 350 },
    "鮭の塩焼き": { type: "主菜", P: 40, L: 10, C: 0, V: 0, kcal: 250 },
    "きゅうり": { type: "素材", P: 1, L: 0, C: 5, V: 50, kcal: 15 },
    "ゆで卵": { type: "主菜", P: 15, L: 12, C: 1, V: 0, kcal: 160 },
    "豆腐 (木綿)": { type: "素材", P: 10, L: 6, C: 2, V: 0, kcal: 100 },
    "麻婆豆腐": { type: "主菜", P: 20, L: 20, C: 10, V: 10, kcal: 300 }, // 初級用
    "野菜サラダ": { type: "副菜", P: 5, L: 5, C: 10, V: 80, kcal: 100 }, // 初級用
    "味噌汁": { type: "副菜", P: 3, L: 1, C: 5, V: 20, kcal: 50 }, // 初級用
};

// 対象者別の一食の推奨摂取量（簡略化：一日の1/3程度を想定）
const TARGET_RDA = {
    "子供": { P_min: 15, P_max: 25, L_min: 10, L_max: 30, C_min: 70, C_max: 120, V_min: 50, kcal_max: 700 },
    "成人男性": { P_min: 20, P_max: 35, L_min: 15, L_max: 40, C_min: 100, C_max: 160, V_min: 100, kcal_max: 900 },
    "成人女性": { P_min: 18, P_max: 30, L_min: 12, L_max: 35, C_min: 80, C_max: 140, V_min: 80, kcal_max: 800 },
    "お年寄り": { P_min: 25, P_max: 35, L_min: 10, L_max: 30, C_min: 70, C_max: 120, V_min: 80, kcal_max: 750 },
};

// ---------------------------------------------
// 🎮 ゲーム初期設定とUI操作
// ---------------------------------------------

function startGame() {
    const difficulty = document.getElementById('difficulty').value;
    targetUser = document.getElementById('target').value;

    // 料理人モードの特殊設定
    if (difficulty === 'chef') {
        const targets = ["子供", "成人男性", "成人女性", "お年寄り"];
        const randomTargets = [];
        for (let i = 0; i < 3; i++) {
            randomTargets.push(targets[Math.floor(Math.random() * targets.length)]);
        }
        document.getElementById('target-display').textContent = 
            `対象者 (料理人モード): ${randomTargets.join(', ')} (難易度: ${difficulty})`;
        // 料理人モードではtargetUserを配列として扱うか、評価ロジックを複雑化する必要がありますが、
        // ここではUI表示のみにとどめます。評価は成人男性で代替します。
        targetUser = '成人男性'; 
        alert("料理人モード開始！複数の対象者に合わせた献立を作ってください！\n（評価は成人男性の基準で行われます）");
    } else {
        document.getElementById('target-display').textContent = 
            `対象者: ${targetUser} (難易度: ${difficulty})`;
    }

    selectedFoods = [];
    updateSelectedList();
    displayFoodSelection(difficulty);
    document.getElementById('results').classList.add('hidden');
    document.getElementById('game-area').classList.remove('hidden');
}

function displayFoodSelection(difficulty) {
    const selectionDiv = document.getElementById('food-selection');
    selectionDiv.innerHTML = '';
    
    let foodsToShow = [];
    
    // 難易度に応じて表示する食品を変える
    const allFoods = Object.keys(FOOD_NUTRITION_DATA).map(name => ({
        name: name,
        type: FOOD_NUTRITION_DATA[name].type
    }));

    if (difficulty === 'easy') {
        // 完成料理（主食、主菜、副菜）のみ
        foodsToShow = allFoods.filter(f => f.type !== '素材');
    } else if (difficulty === 'medium') {
        // 主食/主菜/副菜＋素材も一部
        foodsToShow = allFoods.filter(f => f.type !== '素材' || f.name === 'きゅうり' || f.name === '豆腐 (木綿)');
    } else {
        // 上級/料理人モード: 全ての食品を表示
        foodsToShow = allFoods;
    }

    foodsToShow.forEach(food => {
        const button = document.createElement('button');
        button.textContent = food.name;
        // ボタンのデザインに役立つよう、タイプをクラスに追加
        button.classList.add('food-item', food.type.toLowerCase()); 
        button.onclick = () => addFood(food.name);
        selectionDiv.appendChild(button);
    });
}

function addFood(foodName) {
    // 難易度に応じた食材の組み合わせ制限は、ここでは省略します。
    // 例：上級では「きゅうり」と「豆腐」を選んで「冷奴」を作る、などの複雑なロジックはPython側で処理すべきです。
    selectedFoods.push(foodName);
    updateSelectedList();
}

function updateSelectedList() {
    const ul = document.getElementById('selected-foods-list');
    ul.innerHTML = '';
    
    if (selectedFoods.length === 0) {
        ul.innerHTML = '<li>献立に食品を追加してください</li>';
        return;
    }

    selectedFoods.forEach((food, index) => {
        const li = document.createElement('li');
        li.innerHTML = `${food} 
            <button onclick="removeFood(${index})" style="margin-left: 10px; font-size: 0.8em;">削除</button>`;
        ul.appendChild(li);
    });
}

function removeFood(index) {
    selectedFoods.splice(index, 1); // 配列から該当要素を削除
    updateSelectedList();
}

// ---------------------------------------------
// 💯 評価ロジック
// ---------------------------------------------

function calculateNutrition() {
    let total = { P: 0, L: 0, C: 0, V: 0, kcal: 0 };
    
    selectedFoods.forEach(foodName => {
        const data = FOOD_NUTRITION_DATA[foodName];
        if (data) {
            total.P += data.P;
            total.L += data.L;
            total.C += data.C;
            total.V += data.V;
            total.kcal += data.kcal;
        }
    });
    return total;
}

function evaluateMeal() {
    if (selectedFoods.length === 0) {
        alert("献立を選んでください！");
        return;
    }
    
    const target = targetUser; // 現在の対象者
    const targetRDA = TARGET_RDA[target];
    const currentNutrition = calculateNutrition();
    
    let score = 0;
    let feedback = [];

    // 1. 主要栄養素のバランス評価
    const nutrients = ['P', 'L', 'C']; // タンパク質, 脂質, 炭水化物
    
    nutrients.forEach(n => {
        const current = currentNutrition[n];
        const min = targetRDA[`${n}_min`];
        const max = targetRDA[`${n}_max`];
        const name = { P: 'タンパク質', L: '脂質', C: '炭水化物' }[n];
        
        if (current >= min && current <= max) {
            score += 200; // 理想的な範囲
            feedback.push(`✅ ${name}: 理想的な摂取量です (${min}-${max}g 達成)`);
        } else if (current < min) {
            score += 50; // 不足
            feedback.push(`⚠️ ${name}: 不足しています！最低${min}g必要です。`);
        } else if (current > max * 1.5) {
            score += 0; // 大幅過剰
            feedback.push(`❌ ${name}: 大幅に過剰です！健康上の注意が必要です。`);
        } else if (current > max) {
            score += 100; // やや過剰
            feedback.push(`⚠️ ${name}: やや過剰です。最大${max}gに抑えましょう。`);
        }
    });

    // 2. 野菜（ビタミン/ミネラル）の評価
    const vMin = targetRDA.V_min;
    if (currentNutrition.V >= vMin) {
        score += 300;
        feedback.push(`✅ 野菜/ビタミン: 目標量${vMin}gを達成しました！`);
    } else {
        score += 100;
        feedback.push(`⚠️ 野菜/ビタミン: 不足しています。もう少し野菜を取り入れましょう。`);
    }

    // 3. 総カロリーの評価
    const kcalMax = targetRDA.kcal_max;
    if (currentNutrition.kcal <= kcalMax && currentNutrition.kcal >= kcalMax * 0.7) {
        score += 200;
        feedback.push(`✅ カロリー: 適切な範囲です (${currentNutrition.kcal}kcal)。`);
    } else if (currentNutrition.kcal > kcalMax) {
        score += 50;
        feedback.push(`⚠️ カロリー: 過剰です (${currentNutrition.kcal}kcal)。`);
    } else {
        score += 100;
        feedback.push(`⚠️ カロリー: 少し足りません (${currentNutrition.kcal}kcal)。`);
    }

    // 4. 品目数のボーナス（多様性）
    score += selectedFoods.length * 10;
    
    // 最終スコア表示
    const finalScore = score;
    
    document.getElementById('score-display').textContent = `総合スコア: ${finalScore}点 / 1210点満点`;
    document.getElementById('feedback-display').textContent = feedback.join('\n');
    document.getElementById('results').classList.remove('hidden');
    
    // 現在の栄養素表示（デバッグ・学習用）
    const nutritionSummary = `
--- 栄養サマリー（目標: ${targetRDA.P_min}-${targetRDA.P_max}P, ${targetRDA.V_min}V, max${kcalMax}kcal）---
P (タンパク質): ${currentNutrition.P} g
L (脂質): ${currentNutrition.L} g
C (炭水化物): ${currentNutrition.C} g
V (野菜仮想量): ${currentNutrition.V} g
総カロリー: ${currentNutrition.kcal} kcal
`;
    document.getElementById('feedback-display').textContent += nutritionSummary;

}

// ゲーム開始時の初期化
document.addEventListener('DOMContentLoaded', () => {
    // 難易度と対象者のドロップダウンに値をセット（index.htmlに要素がない場合はエラーになるので注意）
    // 実際にはindex.htmlでstartGame()をボタンに紐づける
});
