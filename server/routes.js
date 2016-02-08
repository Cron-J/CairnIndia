'use strict';

// Load modules

var User = require('./controller/user'),
    Static = require('./static'),
    Pipeline = require('./controller/pipeline');

// API Server Endpoints
exports.endpoints = [


    // Pipeline Routes
    {
        method: 'POST',
        path: '/createPipeline',
        config: Pipeline.createPipeLine
    }, {
        method: 'GET',
        path: '/getPipeline',
        config: Pipeline.getPipeLine
    }, {
        method: 'GET',
        path: '/getPipeLinebyId/{id}',
        config: Pipeline.getPipeLinebyId
    }, 

    {
        method:'POST',
        path:'/defaults',
        config:Pipeline.defaultPipelines
    },
    {
        method: 'POST',
        path: '/calculatePipelinedata',
        config: Pipeline.calculateBarrel
    },{
        method: 'PUT',
        path: '/updatePipeline/{id}',
        config: Pipeline.updatePipeline
    }, {
        method: 'DELETE',
        path: '/removePipeline/{id}',
        config: Pipeline.removePipeline
    },
    {
        method: 'GET',
        path: '/getAGIData',
        config: Pipeline.getAGIData
    },
    {
        method: 'GET',
        path: '/getKpData',
        config: Pipeline.getKpPoint
    },


    {
        method: 'GET',
        path: '/{somethingss*}',
        config: Static.get
    },
     {
        method: 'POST',
        path: '/admin',
        config: User.createAdmin
    },

    /**
       POST: /activateUser
       SCOPE: 'Admin', 'Tenant-Admin'
       Description: Activate tenant User.
    */
    {
        method: 'POST',
        path: '/activateUser',
        config: User.activateUser
    },

    /**
       POST: /deActivateUser
       SCOPE: 'Admin', 'Tenant-Admin'
       Description: deActivate tenant User.
    */
    //{ method: 'POST', path: '/deActivateUser', config: User.deActivateTenantUser},

    /**
       PUT: /user
       SCOPE: 'Admin', 'Tenant-Admin', 'User'
       Description: Update own info for one who is logged in i.e. Admin, Tenant Admin, Tenant User.
    */
    {
        method: 'PUT',
        path: '/user',
        config: User.updateUser
    },

    /**
        PUT: /user/{id}
        SCOPE: 'Tenant-Admin'
        @param id : user id of Tenant User whose info need to be edited.
        Description: Update Tenant User info by System Admin.
    */
    //{ method: 'PUT', path: '/user/{id}', config: User.updateTenantUser},

    /**
        PUT: /user/{id}/{tenantId}
        SCOPE: 'Admin'
        @param id : user id of Tenant User whose info need to be edited.
        @param tenantId : tenant id of tenant whose use info is to be updated.
        Description: Update Tenant User info by System Admin.
    */
    {
        method: 'PUT',
        path: '/user/{id}',
        config: User.updateUser
    },

    /**
        POST: /searchUser
        SCOPE: 'Admin'
        Description: Search User based on certain field/criteria (firstName, lastName, email, tenantId).
    */
    {
        method: 'POST',
        path: '/searchUser',
        config: User.searchUser
    },
    //{ method: 'GET', path: '/exportUser', config: User.exportUser},

    /**
        GET: /user
        Description: Get User own information.
    */
    {
        method: 'GET',
        path: '/user',
        config: User.getUser
    },

    /**
        GET: /user/{id}
        @param id : user id of Tenant User whose info is to be get
        Description: Get Tenant User information.
    */
    {
        method: 'GET',
        path: '/user/{id}',
        config: User.getUserByAdmin
    },

    /**
        GET: /user/{id}
        @param id : user id of Tenant User whose info is to be get
        Description: Get Tenant User information.
    */
    //{ method: 'GET', path: '/userByTenant/{id}', config: User.getUserByTenant},

    /**
        POST: /login
        SCOPE: Open for all
        Description: Login user.
    */
    {
        method: 'POST',
        path: '/login',
        config: User.login
    },

    /**
        POST: /forgotPassword
        SCOPE: Open for all
        Description: Email will be send to user email.
    */
    {
        method: 'POST',
        path: '/forgotPassword',
        config: User.forgotPassword
    }, {
        method: 'PUT',
        path: '/emailVerification',
        config: User.emailVerification
    },
    // { method: 'POST', path: '/resendVerificationMail', config: User.resendVerificationMail},

    {
        method: 'POST',
        path: '/user',
        config: User.createUser
    },
    // { method: 'GET', path: '/tenantUser/{id}', config: User.getAllTenantUserByTenant},
    // { method: 'GET', path: '/tenantDeactiveUser/{id}', config: User.getAllDeactiveTenantUserByTenant},
    {
        method: 'POST',
        path: '/tenantUser',
        config: User.createTenantUser
    },
    // { method: 'POST', path: '/tenantUserCreation', config: User.createTenantUserbyTenant},
    {
        method: 'POST',
        path: '/sendActivationEmail',
        config: User.sendActivationEmail
    },
    // { method: 'POST', path: '/sendCredentials', config: User.sendCredentials},
    {
        method: 'POST',
        path: '/changePassword',
        config: User.changePasswordRequest
    }


];
