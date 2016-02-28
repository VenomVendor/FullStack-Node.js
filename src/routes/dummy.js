class Dummy {

    constructor(type) {
        this.type = type;
    }

    getData(res) {
        const data = {
            success: 'success',
            type: this.type
        };
        res.json(data);
        res.end();
    }
}

export default Dummy;
