module.exports = {
    vector(x, y, z) {
        return { x, y, z };
    },
    distance(p, q) {
        return Math.sqrt((Math.pow(p.x-q.x),2)+(Math.pow(q.z-p.z),2));
    },
    randomInt(min, max){
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}