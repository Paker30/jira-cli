import assert from 'assert';
import S from 'sanctuary';
const { show, Just, Nothing } = S;
import {
    getConfig,
    getSet,
    getCredentials,
    getUrl,
    getPrint,
    getIssue,
    getEstimation,
    getAssignee,
    getOriginal,
    getRemaining,
    getDeveloper,
    setCredentials,
    setUrl,
    setEstimation,
    setAssignation,
    printConfig,
    estimationBody,
    assigneeBody,
    updateUrl,
    updateCredentials
} from '../src/main.js';

describe('Index', function () {
    describe('getters', function () {
        describe('getConfig', () => {
            it('there is config key', () => {
                assert.strictEqual(show(getConfig({ config: true })), show(Just(true)));
            });
            it('there is not config key', () => {
                assert.strictEqual(show(getConfig({})), show(Nothing));
            });
        });
        describe('getSet', () => {
            it('there is set key', () => {
                assert.strictEqual(show(getSet({ set: true })), show(Just(true)));
            });
            it('there is not set key', () => {
                assert.strictEqual(show(getSet({})), show(Nothing));
            });
        });
        describe('getCredentials', () => {
            it('there is credentials key', () => {
                assert.strictEqual(show(getCredentials({ credentials: true })), show(Just(true)));
            });
            it('there is not credentials key', () => {
                assert.strictEqual(show(getCredentials({})), show(Nothing));
            });
        });
        describe('getUrl', () => {
            it('there is url key', () => {
                assert.strictEqual(show(getUrl({ url: true })), show(Just(true)));
            });
            it('there is not url key', () => {
                assert.strictEqual(show(getUrl({})), show(Nothing));
            });
        });
        describe('getPrint', () => {
            it('there is print key', () => {
                assert.strictEqual(show(getPrint({ print: true })), show(Just(true)));
            });
            it('there is not print key', () => {
                assert.strictEqual(show(getPrint({})), show(Nothing));
            });
        });
        describe('getIssue', () => {
            it('there is issue key', () => {
                assert.strictEqual(show(getIssue({ issue: true })), show(Just(true)));
            });
            it('there is not issue key', () => {
                assert.strictEqual(show(getIssue({})), show(Nothing));
            });
        });
        describe('getEstimation', () => {
            it('there is estimation key', () => {
                assert.strictEqual(show(getEstimation({ estimation: true })), show(Just(true)));
            });
            it('there is not estimation key', () => {
                assert.strictEqual(show(getEstimation({})), show(Nothing));
            });
        });
        describe('getAssignee', () => {
            it('there is assignee key', () => {
                assert.strictEqual(show(getAssignee({ assignee: true })), show(Just(true)));
            });
            it('there is not assignee key', () => {
                assert.strictEqual(show(getAssignee({})), show(Nothing));
            });
        });
        describe('getOriginal', () => {
            it('there is original key', () => {
                assert.strictEqual(show(getOriginal({ '--original': '1d' })), show(Just('1d')));
            });
            it('there is not original key', () => {
                assert.strictEqual(show(getOriginal({})), show(Nothing));
            });
        });
        describe('getRemaining', () => {
            it('there is remaining key', () => {
                assert.strictEqual(show(getRemaining({ '--remaining': '1d' })), show(Just('1d')));
            });
            it('there is not remaining key', () => {
                assert.strictEqual(show(getRemaining({})), show(Nothing));
            });
        });
        describe('getDeveloper', () => {
            it('there is developer key', () => {
                assert.strictEqual(show(getDeveloper({ '<developer>': 'mortadelo' })), show(Just('mortadelo')));
            });
            it('there is not developer key', () => {
                assert.strictEqual(show(getDeveloper({})), show(Nothing));
            });
        });
    });
    describe('choose action', () => {
        it('add credentials', () => {
            assert.strictEqual(show(setCredentials({ config: true, set: true, credentials: true })), show(Just(true)));
        });
        it('add url', () => {
            assert.strictEqual(show(setUrl({ config: true, url: true })), show(Just(true)));
        });
        it('add estimation', () => {
            assert.strictEqual(show(setEstimation({ issue: true, set: true, estimation: true })), show(Just(true)));
        });
        it('add assignation', () => {
            assert.strictEqual(show(setAssignation({ issue: true, set: true, assignee: true })), show(Just(true)));
        });
        it('print configuration', () => {
            assert.strictEqual(show(printConfig({ config: true, print: true })), show(Just(true)));
        });
    });
    describe('request bodies', () => {
        describe('estimation', () => {
            it('original estimation', () => {
                assert.deepStrictEqual(estimationBody({ '--original': '1d' }), {
                    'update': {
                        'timetracking': [{ 'edit': { originalEstimate: '1d' } }]
                    }
                });
            });
            it('original and remaining estimation', () => {
                assert.deepStrictEqual(estimationBody({ '--original': '1d', '--remaining': '3d' }), {
                    'update': {
                        'timetracking': [{ 'edit': { originalEstimate: '1d', remainingEstimate: '3d' } }]
                    }
                });
            });
        });
        it('assignee', () => {
            assert.deepEqual(assigneeBody({ '<developer>': 'mortadelo' }), {
                update: {
                    assignee: [{
                        set: { name: 'mortadelo' }
                    }]
                }
            });
        });
    });
    it('update url', () => {
        const conf = {
            url: '',
            set: function ({ url }) {
                this.url = url;
            }
        };
        updateUrl(conf)({ '<address>': 'http://localhost:8080' });
        assert.equal(conf.url, 'http://localhost:8080');
    });
    it('update credentials', () => {
        const conf = {
            credentials: {
                user: '',
                password: '',
            },
            set: function ({ credentials }) {
                this.credentials = credentials;
            }
        };
        updateCredentials(conf)({ '<user>': 'mortadelo', '<password>': 'really long and strong' });
        assert.deepEqual(conf.credentials, {
            password: 'really long and strong',
            user: 'mortadelo'
        });
    })
});