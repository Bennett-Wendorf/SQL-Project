// Import zustand for global state management
import create from 'zustand';

// Create a zustand store for global state management
const useStore = create(set => ({
    // Store the current selected person and define a function for updating this piece of state
    selectedPerson: {'personID': -1, 'personName': "All Tasks"},
    setSelectedPerson: (newPerson) => set(state => {
        return({ selectedPerson: newPerson })
    })
}))

export default useStore