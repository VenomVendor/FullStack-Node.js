class Helper {

    isEmpty(text) {
        return text.length === 0;
    }

    isTooEmpty(text) {
        return this.isEmpty(text) || text.trim().length === 0;
    }
}

export default Helper;
