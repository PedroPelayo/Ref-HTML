const amountInput= document.getElementById('amount');
const currencySelect= document.getElementById('currency');
const convertBtn= document.getElementById('convert-btn');
const resultText= document.getElementById('result');
const updateText= document.getElementById('last-update');
const historyList= document.getElementById('history');
const presentationText= document.getElementById('presentation');

//Función para obtener precios reales
async function convertCurrency(){
    const amount= amountInput.value;
    const currency= currencySelect.value; //Ejemplo: 'EUR'

    if(amount===""||amount<=0)return;

    try{
        resultText.innerText="Cargando...";

        //Llamando a una API real (gratuita
        const response=await fetch(`https://open.er-api.com/v6/latest/USD`);
        const data=await response.json();

        //Obtenemos la tasa de cambio dinamicamente
        const rate= data.rates[currency];
        const total= amount*rate;

        const presentation=`Convertiste ${amount} dólares a ${total.toFixed(2)} ${currency}.`;
        presentationText.innerText = `Convertiste ${amount} dólares a ${total.toFixed(2)} ${currency}.`;

        resultText.innerText=`Resultado: ${total.toFixed(2)} ${currency}`;
        updateText.innerText=`Última actualización:${data.time_last_update_utc}`;

        //Registrar el historial
        const li=document.createElement('li');
        li.textContent=`${amount} USD-> ${total.toFixed(2)} ${currency}`;
        historyList.appendChild(li);

        //Guardar historial actualizado
        saveHistory();

    }catch(error){
        resultText.innerText="Error al conectar con la API.";
        console.error(error);
    }

}

//Guardar historial en localStorage
function saveHistory(){
    const items=[];
    historyList.querySelectorAll('li').forEach(li=>{
        items.push(li.textContent);
    });
    localStorage.setItem('conversionHistory', JSON.stringify(items));
}

//Cargar historial al iniciar
function loadHistory(){
    const saved= localStorage.getItem('conversionHistory');
    if (saved){
        const items= JSON.parse(saved);
        items.forEach(text=>{
            const li= document.createElement('li');
            li.textContent= text;
            historyList.appendChild(li);
        });
    }
}

//Función para cargar los datos en la memoria del navegador
function savePreferences(){
    const preferences={
        amount: amountInput.value,
        currency: currencySelect.value
    };
    //Guardamos convirtiendo el objeto a texto(JSON)
    localStorage.setItem('userPrefs', JSON.stringify(preferences));
}

//Función para cargar los datos al iniciar
function loadPreferences(){
    const saved=localStorage.getItem('userPrefs');
    if(saved){
        const data=JSON.parse(saved);
        amountInput.value=data.amount;
        currencySelect.value=data.currency;
        //Opcional ejecutar la conversión al cargar
        convertCurrency();
    }
}

//Modificar el evento del botón para que guarde al convertir
convertBtn.addEventListener('click',()=>{
    convertCurrency();
    savePreferences();
});

//Ejecutar la carga apenas abra la página
window.addEventListener('DOMContentLoaded', ()=>{
     loadPreferences();
    loadHistory();
});