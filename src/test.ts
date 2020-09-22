import test from 'ava';
import '@k2oss/k2-broker-core/test-framework';
import './index';

function mock(name: string, value: any) 
{
    global[name] = value;
}

test('describe returns the hardcoded instance', async t => {
    let schema = null;
    mock('postSchema', function(result: any) {
        schema = result;
    });

    await Promise.resolve<void>(ondescribe({
        configuration: {}
    }));
    
    t.deepEqual(schema, {
        objects: {
            "lines": {
                displayName: "Lines",
                description: "Describes all lines in a CSV file",
                properties: {
                    "file": {
                        displayName: "File",
                        type: "string"
                    },
                    "line": {
                        displayName: "Line",
                        type: "string"
                    }
                },
                methods: {
                    "getLines": {
                        displayName: "Get Lines",
                        type: "read",
                        inputs: [ "file" ],
                        outputs: [ "line" ]
                    }
                }
            }
        }
    });

    t.pass();
});

test('execute fails with the wrong parameters', async t => {
    let error = await t.throwsAsync(Promise.resolve<void>(onexecute({
        objectName: 'test1',
        methodName: 'unused',
        parameters: {},
        properties: {},
        configuration: {},
        schema: {}
    })));
    
    t.deepEqual(error.message, 'The object test1 is not supported.');

    error = await t.throwsAsync(Promise.resolve<void>(onexecute({
        objectName: 'lines',
        methodName: 'test2',
        parameters: {},
        properties: {},
        configuration: {},
        schema: {}
    })));
    
    t.deepEqual(error.message, 'The method test2 is not supported.');

    t.pass();
});