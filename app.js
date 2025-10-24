// app.js (ここではゲームのUI操作と、計算ロジックへの橋渡しを担当)

let selectedFoods = [];

// 食材/料理データ (Pythonデータの一部を模倣)
const availableFoods = [
    { name: "ごはん", type: "主食" },
    { name: "鮭の塩焼き", type: "主菜" },
    { name: "きゅうり", type: "副菜" },
    { name: "ゆで卵", type: "主菜" },
    { name: "麻婆豆腐", type: "主菜" }, // 初級用
    // ...
];


function startGame() {
    const difficulty = document.getElementById('difficulty').value;
    const target = document.getElementById('target').value;

    document.getElementById('target-display').textContent = 
        `対象者: ${target} (難易度: ${difficulty})`;

    selectedFoods = [];
    updateSelectedList();
    displayFoodSelection(difficulty);
    document.getElementById('results').classList.add('hidden');
}

function displayFoodSelection(difficulty) {
    const selectionDiv = document.getElementById('food-selection');
    selectionDiv.innerHTML = '';
    
    let foodsToShow = [];
    
    // 難易度に応じて表示するものを変える（非常に簡略化）
    if (difficulty === 'easy') {
        foodsToShow = availableFoods.filter(f => f.type !== '素材'); // 完成料理だけ
    } else {
        foodsToShow = availableFoods; // 全て
    }

    foodsToShow.forEach(food => {
        const button = document.createElement('button');
        button.textContent = food.name;
        button.onclick = () => addFood(food.name);
        selectionDiv.appendChild(button);
    });
}

function addFood(foodName) {
    selectedFoods.push(foodName);
    updateSelectedList();
}

function updateSelectedList() {
    const ul = document.getElementById('selected-foods-list');
    ul.innerHTML = '';
    selectedFoods.forEach(food => {
        const li = document.createElement('li');
        li.textContent = food;
        ul.appendChild(li);
    });
}

function evaluateMeal() {
    if (selectedFoods.length === 0) {
        alert("献立を選んでください！");
        return;
    }
    
    const target = document.getElementById('target').value;
    
    // ******************************************************
    // *** 📌 本来はここでPythonサーバーにデータを送り、   ***
    // *** 栄養計算の結果を受け取ります。                     ***
    // ******************************************************
    
    // 簡易的な結果表示 (実際のPythonロジックを模倣した仮のデータ)
    const score = selectedFoods.length * 100 + Math.floor(Math.random() * 500);
    const feedbackText = score > 500 
        ? "非常にバランスの取れた献立です！" 
        : "エネルギーは十分ですが、野菜が不足しているかもしれません。";
    
    document.getElementById('score-display').textContent = `総合スコア: ${score}点`;
    document.getElementById('feedback-display').textContent = feedbackText;
    document.getElementById('results').classList.remove('hidden');
}
