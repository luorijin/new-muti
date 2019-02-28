import Mock from "mockjs"
let baseUrl = 'http://bb.com/rest/api'
Mock.mock(/\/newsvy\/act\/list/,{
    'total|10-20': 10,
    'list|10-20':[{
        'id':'@guid()',
        'title':'@csentence(5,20)',
        'picUrl':'@image()',
        'startDate':Number(new Date(2019,2,22)),
        'endDate':Number(new Date()),
        'state|0-2':0,
        'groupName':'西双版纳供电局',
        'source':"党建人事部"
        }
    ]
})
Mock.mock(/lib_md5\/data.md5.json/,{
    'list|50':[{
        'id':'@guid()',
        'title':'@csentence(5,20)',
        "type|0-2":0,
        'mediaType|0-2':0,
        'mediaUrl':'@url()',
        'answerValue':"1,2,3",
        "answerAnalysis":'@csentence(5,20)',
        "knowledgeId|1-100":1,
        "optionList|1-7":[{
            "id":'@guid()',
            "title":'@csentence(5,20)',
            "value|+1":1

        }],
        'picUrl':'@image()',
        'startDate':Number(new Date(2019,2,22)),
        'endDate':Number(new Date()),
        'state|0-2':0,
        'groupName':'西双版纳供电局',
        'source':"党建人事部"
        }
    ]
})