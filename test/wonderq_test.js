const {expect} = require('chai');
const wonderq = require('../lib/wonderq');
const db = require('../lib/db');

describe('queue()', () => {
    it('should validate and queue a message for consumption', () => {
        let omsg = {
            topic: 'index',
            message: 'users',
            ip: '::1'
        }


        wonderq.queue(omsg, (err, result) => {
            if (err !== undefined) {
                expect(err).not.to.be.a(Error);
            }

            db.get(result.id, (err, msg) => {
                if (err !== undefined) {
                    expect(err).not.to.be.a(Error);
                }

                expect(msg).to.be.equal(result);
            });
        });
    });
});

describe('consume()', () => {
    it('should validate a set of keys have locks', () => {

        wonderq.consume((err, data) => {
            if (err !== undefined) {
                expect(err).not.to.be.a(Error);
            }

            let okeys = [];
            for (d of data) {
                okeys.push('lock:message:'+d.id);
            }

            db.keys('lock:message:*', (err, keys) => {
                if (err !== undefined) {
                    expect(err).not.to.be.a(Error);
                }

                expect(keys).to.have.all.members(okeys);
            })
        })
    })
})

describe('rm()', () => {
    it('should return null for a non-existant key', () => {
        let omsg = {
            topic: 'index',
            message: 'users',
            ip: '::1'
        }

        wonderq.queue(omsg, (err, result) => {
            if (err !== undefined) {
                expect(err).not.to.be.a(Error);
            }

            wonderq.rm(result.id, (err, ok) => {
                if (err !== undefined) {
                    expect(err).not.to.be.a(Error);
                }

                expect(ok).to.be.equal(true);
            });
        });
    });
});

describe('keyCount()', () => {
    it('should return a value greater than or equal to zero', () => {
        wonderq.keyCount(['queue'], (err, result) => {
            if (err !== undefined) {
                expect(err).not.to.be.a(Error);
            }

            expect(result).to.have.all.members.be.a('number');
        })
    })
})

describe('tail()', () => {
    it('should return an array', () => {
        wonderq.tail('queue', 20, (err, msgs) => {
            if (err !== undefined) {
                expect(err).not.to.be.a(Error);
            }

            expect(msgs).to.be.a('array');
        })
    })
})

describe('flush()', () => {
    it('should return a number', () => {
        wonderq.flush(['queue', 'process'], (err, total) => {
            if (err !== undefined) {
                expect(err).not.to.be.a(Error);
            }

            expect(t).to.be.a('number');
        })
    })
})