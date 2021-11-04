// Import zustand for global state management
import create from 'zustand';

const useStore = create(set => ({
    selectedPerson: {'personID': -1, 'personName': "All Tasks"},
    setSelectedPerson: (newPerson) => set(state => {
        // console.log("newPerson from stores.js in useStore: ");
        // console.log(newPerson);
        return({ selectedPerson: newPerson })
    })
}))

export default useStore