/////////////////////////////////////////////////////////////////////////////////////////////////

function global_node() {
    // object dictionary - Stores the name and objects for every major "defun" function & global
    // variables found
    this.obj_dict = {};
    this.defun = {};
    this.global_vars = {};
    
    this._add_global_obj = function(global_var_name, global_var_obj) {
        this.obj_dict[global_var_name] = global_var_obj;
    }
    
    this._add_global_var = function(global_var_name, global_var_obj) {
        this.global_vars[global_var_name] = global_var_obj;
    }
    
    this._add_global_func = function(global_var_name, global_func_obj) {
        this.defun[global_var_name] = global_func_obj;
    }
    
    this.add_obj = function(obj_type, obj) {
        switch(obj_type) {
            case "global_var":
                this._add_global_var(obj.name, obj);
                this._add_global_obj(obj.name, obj);
                break;
            
            case "defun":
                this._add_global_func(obj.name, obj);
                this._add_global_obj(obj.name, obj);
                break;
        }
    }
    
    this.get_defun = function(name) {
        return this.defun[name];
    }
}

var GlobalIntellisenseRoot = new global_node();

function type_object() {
    this.name = ""
    this.type = "";
    this.parent = null;
    this.child  = null;
    this.value = null;
}

// type = "defun" || "function"
function type_function(type, name, ast, args) {
    this.name = name;
    this.type = type;
    this.ast = ast;
    this.arguments = args;
    
    this.super_class = [];
    this.sub_class   = [];
    
    this.classes_where_composed = [];
    this.classes_this_composes = [];
    
    this.dependencies = [];
    
    this.class_members  = [];
    this.local_vars = [];
    
    this.obj = null;
    
    this.walk_function = function() {
        // Walk the ast for the function alone to generate the dependency graph
        var code_ast = ast[1][0][3];
        
        for (var i = 0; i < code_ast.length; ++i) {
            var expr = walk_tree(code_ast[i]);
            
            if (expr != null) {
                switch(expr.type) {
                    case "assign_expr":
                    var right_expr = expr.right_expr;
                    
                    if (right_expr.type == "composition") {
                        this.classes_this_composes.push(right_expr);
                        this.dependencies.push(parse_expr(right_expr));
                    } else {
                        this.dependencies.push(parse_expr(right_expr));
                    }
                    
                    var left_expr = expr.left_expr;
                    var dict = {};
                    
                    if (left_expr.name == "this") {
                        var left_str = parse_expr(left_expr.child);
                        dict[left_str] = right_expr.type;
                        this.class_members.push(dict);
                    }
                    else {
                        var left_str = parse_expr(left_expr);
                        dict[left_str] = right_expr.type;
                        this.local_vars.push(dict);
                    }
                    break;
                
                    case "return_expr":
                        break;
                }
            }
        }
    }
    
    this.generate_code = function() {
        if (this.obj == null) {
            'usr strict';
            this.code = window['gen_code'](ast, { beautify : true });
            var eval_code = eval("(" + this.code + ")");
            this.obj = new eval_code();
            this.data_members = Introspect.get_all_variables(this, this.obj);
        }
    }
    
    this.walk_function();
    
    try {
        this.generate_code();
        window[this.name] = this.obj;
    }
    catch(e) {
        // Do nothing. We will generate the code later.
    }
}

type_function.prototype = new type_object();


function type_variable() {
    
}

type_variable.prototype = new type_object();

function type_expression() {
}

type_expression.prototype = new type_object();

function assign_expression() {
    this.left_expr = new type_expression();
    this.right_expr = new type_expression();
}

type_expression.prototype = new type_object();

function binary_expression() {
    this.operator = "";
    this.binary_lhs = null;
    this.binary_rhs = null;
}

binary_expression.prototype = new type_object();