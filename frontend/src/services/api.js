import axios from "axios"

const api = axios.create({
    baseURL:'http://localhost:8000',
    timeout:5000,
    headers:{
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    withCredentials:true
})

const gameApi = {
    getNewGame: async () => {
        try{
            const response = await api.get('/queen');
            return response.data;
        }
        catch(error){
            console.error("Error fetching game data: ",error);
            throw error;
        }
    },
    placeQueen: async () => {
        try{
            const response = await api.post('/queen',{board});
            return response.data;
        }
        catch(error){
            console.error('Error placing queen: ', error);
            throw error;
        }
    },
    resetGame: async ()=> {
        try{
            const response = await api.get('/new-game');
            return response.data;
        }catch(error){
            console.error('Error resetting game: ',error);
            throw error;
        }
    }
};

export {api, gameApi};